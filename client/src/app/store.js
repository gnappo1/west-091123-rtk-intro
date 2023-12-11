import {configureStore} from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import productionReducer from "../features/production/productionSlice"
import { userApi } from "../services/userApi"
import { productionApi } from "../services/productionApi"
import { authApi } from "../services/auth_api"

export const store = configureStore({
    reducer: {
        production: productionReducer,
        user: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        [productionApi.reducerPath]: productionApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware, authApi.middleware, productionApi.middleware),
    devTools: {trace: true, traceLimit: 35}
})