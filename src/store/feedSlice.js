import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => action.payload,
        removeFeed: () => { return null },
        removeUserFromFeed: (state, action) => {
            const newFeed = state.filter((feedCard) => feedCard._id != action.payload);
            return newFeed;
        },
    }
})

export const { addFeed,removeFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;