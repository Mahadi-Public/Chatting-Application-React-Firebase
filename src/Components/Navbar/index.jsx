import { HomeButtonIcons } from "../../Svg/HomeButton";
import { LogoutButtonIcons } from "../../Svg/LogoutButton";
import { MessagesButtonIcons } from "../../Svg/MessageButton";
import { UploadImageIcons } from "../../Svg/UploadImage";
import AvatarImage from '../../../public/Images/Avatar.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileUpload from "../Modal";
import { auth } from "../../Database/firebaseConfig";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { LoggedOutUser } from "../../features/loginSlice";
import { useToast } from "../../useToast";

const Navbar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const user = useSelector((state) => state.Login.loggedIn);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogoutUser = () => {
    signOut(auth).then(() => {
      navigate('/');
      localStorage.removeItem('LoginUser');
      dispatch(LoggedOutUser());
      toast.success("Successfully logout your account")
    }).catch((error) => {
      toast.error("Error", error.message)
    });
  }

  return (
    <>
      <div className='bg-[#5E3493] h-screen w-[105px] flex flex-col justify-between items-center py-4'>
        <div className="relative group">
          <div className='w-20 h-20 rounded-full overflow-hidden mx-auto'>
            <img
              src={user.photoURL || AvatarImage}
              alt="Avatar"
              className='w-full h-full object-cover transition duration-300 group-hover:opacity-30'
            />
          </div>
          <div className="w-20 h-20 absolute inset-0 left-3 flex justify-center items-center text-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300" onClick={() => setShowProfileModal(true)}>
            <UploadImageIcons />
          </div>
          <h3 className="font-fontInterRegular text-white text-lg mt-2 text-center">{user.displayName}</h3>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/"
            className={`text-white outline-none cursor-pointer ${location.pathname === '/' ? 'border-r-4 border-white px-6' : ''}`}
          >
            <HomeButtonIcons />
          </Link>
          <Link
            to="/message"
            className={`text-white outline-none cursor-pointer ${location.pathname === '/message' ? 'border-r-4 border-white px-6' : ''}`}
          >
            <MessagesButtonIcons />
          </Link>
        </div>
        <div className="cursor-pointer" onClick={handleLogoutUser}>
          <div className="text-white flex gap-x-2">
            <LogoutButtonIcons />
            <span className="font-fontInterRegular text-base">Log out</span>
          </div>
        </div>
      </div>
      {showProfileModal && <ProfileUpload showProfileModal={showProfileModal} setShowProfileModal={setShowProfileModal} />}
    </>
  );
};

export default Navbar;
