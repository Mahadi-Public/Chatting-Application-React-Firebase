import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../../Pages/LoginPage";

export default function LoggedInUserRoute() {
    const user = useSelector((user) => user.Login.loggedIn);
    return user ? <Outlet /> : <Login />
}