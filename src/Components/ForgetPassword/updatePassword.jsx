import { getAuth, confirmPasswordReset } from "firebase/auth";
import { useState } from "react";
import { useToast } from "../../useToast";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const auth = getAuth();

  const queryParams = new URLSearchParams(window.location.search);
  const oobCode = queryParams.get("oobCode");

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(!loading);
    confirmPasswordReset(auth, oobCode, password)
      .then(() => {
        toast.success("Password reset successful!");
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(loading);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleResetPassword} className="w-full max-w-md">
        <div>
          <label className='font-fontInterRegular text-[#484848] text-[18px]'>Enter New Password</label>
          <input
            type='password'
            className='w-full px-2 py-2 border outline-none my-3 border-[#D8D8D8]'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='New Password'
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className='bg-[#313131] text-white font-fontInterRegular text-base w-full py-4 my-3 rounded-md cursor-pointer'
        >
          {loading ? <BeatLoader size={10} color="#ffffff" /> : "Reset Password"}
        </button>
      </form>
      <p className='font-fontInterRegular text-base text-black text-[16px] mt-5'>
        Remembered your password? <Link to="/login" className='text-[#236DB0] cursor-pointer'>Login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
