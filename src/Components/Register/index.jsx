import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../Validation/vaildations";
import { FaEye } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";
import { useState } from "react";
import { useToast } from "../../useToast";
import { BeatLoader } from "react-spinners";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const db = getDatabase();

  const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const createNewUsers = () => {
    setLoading(!loading);
    let { email, password, fullName } = formik.values;
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        updateProfile(auth.currentUser, {
          displayName: fullName,
        }).then(() => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              set(ref(db, 'users/' + user.uid), {
                username: user.displayName,
                email: user.email,
              })
            })
            .then(() => {
              toast.success('Email send, please verify your email.')
              let setTime = setTimeout(() => {
                navigate('/login')
              }, 3000);
              setLoading(loading)
              return () => clearTimeout(setTime)
            })
            .catch((error) => {
              toast.error('Error during signup:', error.message)
              setLoading(loading)
            })
        }).catch((error) => {
          toast.error('Error during signup:', error.message)
        });
      })
      .catch((error) => {
        if (error.message.includes('auth/email-already-in-use')) {
          toast.error('Email already exists!')
          setLoading(loading)
        }
      });
  }

  const formik = useFormik({
    initialValues,
    onSubmit: createNewUsers,
    validationSchema: signUp
  });


  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {/* Full Name Field */}
        <div>
          <label className='font-fontInterRegular text-[#484848] text-[18px]'>Enter Full Name</label>
          <input
            type='text'
            className={`w-full px-2 py-2 border outline-none my-3 ${formik.errors.fullName && formik.touched.fullName ? 'border-red-500' : 'border-[#D8D8D8]'}`}
            name='fullName'
            onChange={formik.handleChange}
            value={formik.values.fullName}
          />
          {formik.errors.fullName && formik.touched.fullName && (
            <p className="font-fontInterRegular text-red-500 text-sm mb-2">{formik.errors.fullName}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className='font-fontInterRegular text-[#484848] text-[18px]'>Enter Email</label>
          <input
            type='text'
            className={`w-full px-2 py-2 border outline-none my-3 ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-[#D8D8D8]'}`}
            name='email'
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="font-fontInterRegular text-red-500 text-sm mb-2">{formik.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex flex-col">
            <label className='font-fontInterRegular text-[#484848] text-[18px]'>Enter Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-2 py-2 border outline-none my-3 ${formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-[#D8D8D8]'}`}
                name='password'
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <IoEyeOffSharp />}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="font-fontInterRegular text-red-500 text-sm mb-2">{formik.errors.password}</p>
            )}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <div className="flex flex-col">
            <label className='font-fontInterRegular text-[#484848] text-[18px]'>Enter Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full px-2 py-2 border outline-none my-3 ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : 'border-[#D8D8D8]'}`}
                name='confirmPassword'
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <IoEyeOffSharp />}
              </button>
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <p className="font-fontInterRegular text-red-500 text-sm mb-2">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <button disabled={loading} type="submit" className='bg-[#313131] text-white font-fontInterRegular text-base w-full py-4 my-3 rounded-md cursor-pointer'>
          {
            loading ? <BeatLoader color='#ffff' /> : "Sign Up"
          }
        </button>
      </form>
      <p className='font-fontInterRegular text-base text-black text-[16px] mt-5'>
        Already have an account?
        <Link to="/login" className='text-[#236DB0] cursor-pointer'> Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterForm;
