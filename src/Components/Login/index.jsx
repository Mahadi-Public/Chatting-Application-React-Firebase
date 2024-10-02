import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../Validation/vaildations";
import { useState } from "react";
import { IoEyeOffSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { useToast } from "../../useToast";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { LoggedInUser } from "../../features/loginSlice";



const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",

  };

  const signInUser = () => {
    setLoading(!loading);
    const { email, password } = formik.values;
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        if (user.emailVerified === true) {
          dispatch(LoggedInUser(user))
          localStorage.setItem("LoginUser", JSON.stringify(user))
          setLoading(loading);
          navigate("/")
          toast.success("Successfully login your account")
        } else {
          toast.error("Please verify your email")
          setLoading(loading);
        }
      })
      .catch((error) => {
        if (error.message.includes('auth/invalid-credential')) {
          toast.error('Email or password is incorrect')
          setLoading(loading);
        }
      });
  }

  const formik = useFormik({
    initialValues,
    onSubmit: signInUser,
    validationSchema: signIn
  });

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit}>
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
          <button disabled={loading} className='bg-[#313131] text-white font-fontInterRegular text-base w-full py-4 my-3 rounded-md cursor-pointer'>
            {
              loading ? <BeatLoader color='#ffff' /> : "Sign Up"
            }
          </button>
        </form>
        <p className='font-fontInterRegular text-base text-black text-[16px] underline cursor-pointer mt-5'><Link to={"/forgot-password"} state={{ email: formik.values.email }}> forgot password? </Link></p>
        <p className='font-fontInterRegular text-base text-black text-[16px] mt-5'>Don’t have an account please <Link to={"/register"} className='text-[#236DB0] cursor-pointer'>sign up</Link></p>
      </div>
    </>
  )
}

export default LoginForm;