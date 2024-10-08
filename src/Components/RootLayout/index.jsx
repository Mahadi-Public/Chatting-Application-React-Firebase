import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const RootLayout = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
