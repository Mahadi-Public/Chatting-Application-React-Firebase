import { useFormik } from 'formik';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../useToast';


const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    email: location.state.email || "",
  };

  const forgetPasswordWithEmail = () => {
    setLoading(!loading);
    sendPasswordResetEmail(auth, formik.values.email)
      .then(() => {
        toast.success("Password reset email sent! Check your inbox.")
        let setTime = setTimeout(() => {
          navigate('/login')
        }, 3000);
        setLoading(loading)
        return () => clearTimeout(setTime)
      })
      .catch((error) => {
        console.log(error.messges)
      });
  }

  const formik = useFormik({
    initialValues,
    onSubmit: forgetPasswordWithEmail,
  });

  return (
    <>
      <div className='flex items-center justify-center h-screen w-full'>
        <div className='flex flex-col justify-center'>
          <h1 className='font-fontJotiRegular font-bold text-[70px] text-center'>TalkNest</h1>
          <div className='bg-white shadow-md rounded-md p-10'>
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
                <button disabled={loading} className='bg-[#313131] text-white font-fontInterRegular text-base w-full py-4 my-3 rounded-md cursor-pointer'>
                  {
                    loading ? <BeatLoader /> : "Forgot Password"
                  }
                </button>
              </form>
              <p className='font-fontInterRegular text-base text-black text-[16px] mt-5'>Remembered your password? <Link to={"/login"} className='text-[#236DB0] cursor-pointer'>sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword;