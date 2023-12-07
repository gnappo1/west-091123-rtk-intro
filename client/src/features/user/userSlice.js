import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { getToken, getRefreshToken } from "../../utility/main";

export const createSlice = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
})

const initialState = {
    data: null,
    errors: [],
    loading: true
}

const register = async ({url, values}, thunkAPI) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
        const data = await response.json()
        if (response.ok) {
            return data
        } else {
            throw data.message    
        }
    } catch (error) {
        return error
    }
}
const fetchMe = async (thunkAPI) => {
    console.log("🚀 ~ file: userSlice.js:28 ~ fetchMe ~ thunkAPI:", thunkAPI)
    try {
        const resp = await fetch("/me", {
            headers: {
                "Authorization": `Bearer ${getToken()}` 
            }
        })
        const data = await resp.json()
        if (resp.ok) {
            return {user: data, flag: "me"}
        } else {
            const response = await fetch("/refresh", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${getRefreshToken()}`
                }
            })
            const data = await response.json()
            if (response.ok) {
                return {...data, flag: "refresh"}
            } else {
                throw data.msg
            }
        }
    } catch (error) {
        return error
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: (create) => ({
        setUser: create.reducer((state, action) => {
            state.data = action.payload
            state.loading = false
        }),
        logout: create.reducer((state, action) => {
            state.data = null
        }),
        addError: create.reducer((state, action) => {
            state.errors.push(action.payload)
        }),
        clearErrors: create.reducer((state, action) => {
            state.errors = []
        }),
        fetchCurrentUser: create.asyncThunk(
            fetchMe,
            {
                pending: (state) => {
                    state.loading = true
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    state.data = action.payload.user
                },
            }
        ),
        fetchRegister: create.asyncThunk(
            register,
            {
                pending: (state) => {
                    state.loading = true
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    state.data = action.payload.user
                },
            }
        )
    }),
    selectors: {
        selectUser(state){
            debugger
            return state.data
        },
        selectErrors(state){
            return state.errors
        }
    }
})

export const {setUser, logout, addError, clearErrors, fetchCurrentUser, fetchRegister} = userSlice.actions
export const {selectUser, selectErrors} = userSlice.selectors
export default userSlice.reducer