import {configureStore} from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import productionReducer from "../features/production/productionSlice"

export const store = configureStore({
    reducer: {
        production: productionReducer,
        user: userReducer,
    },
    devTools: {trace: true}
})