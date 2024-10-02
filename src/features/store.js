import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./loginSlice"
import ActiveSingleSlice from "./activeSingleSlice"

export const store = configureStore({
    reducer: {
        Login: LoginSlice,
        Active: ActiveSingleSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})