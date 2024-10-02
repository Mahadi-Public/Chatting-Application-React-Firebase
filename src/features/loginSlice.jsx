import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: JSON.parse(localStorage.getItem("LoginUser")) || null
}

export const LoginSlice = createSlice({
    name: "LoginUsers",
    initialState,
    reducers: {
        LoggedInUser: (state, action) => {
            state.loggedIn = action.payload
        },

        LoggedOutUser: (state) => {
            state.loggedIn = null
        }
    }
})

export const { LoggedInUser, LoggedOutUser } = LoginSlice.actions;
export default LoginSlice.reducer;