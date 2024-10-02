import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    active: JSON.parse(localStorage.getItem("Active")) || null
}

export const ActiveSingleSlice = createSlice({
    name: "Single",
    initialState,
    reducers: {
        ActiveSingle: (state, action) => {
            state.active = action.payload
        }
    }
})

export const { ActiveSingle } = ActiveSingleSlice.actions;
export default ActiveSingleSlice.reducer;