import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import feedReducer from "./feedSlice"
import ConnectionsReducer from "./connectionsSlice"
import RequestsReducer from "./requestSlice"

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connections: ConnectionsReducer,
        requests: RequestsReducer
    }
})

export default appStore;