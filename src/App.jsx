import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./Pages/HomePage";
import Login from "./Pages/LoginPage";
import RootLayout from "./Components/RootLayout";
import Messages from "./Pages/MessagePage";
import Register from "./Pages/RegisterPage";
import LoggedInUserRoute from "./Components/PrivateRoute/loggedInUserRoute";
import NotLoggedInUserRoute from "./Components/PrivateRoute/notLoggedInUserRoute";
import ForgotPassword from "./Components/ForgetPassword";


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route element={<LoggedInUserRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/message" element={<Messages />} />
        </Route>
      </Route>
      <Route element={<NotLoggedInUserRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </Route>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
