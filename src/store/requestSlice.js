import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "request",
    initialState: null,
    reducers: {
        addRequests: (state, action) => {
            return action.payload
        },

        removeRequests: () => null,

        removeUserFromRequests: (state, action) => {
            const newRequests = state.filter((user) => user._id != action.payload);
            return newRequests;
        },


    }
})

export const { addRequests, removeRequests, removeUserFromRequests } = requestSlice.actions;
export default requestSlice.reducer;