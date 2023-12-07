import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: null,
    errors: [],
    loading: true
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action){
            state.data = action.payload
            state.loading = false
        },
        logout(state){
            state.data = null
        },
        addError(state, action){
            state.errors.push(action.payload)
        },
        clearErrors(state){
            state.errors = []
        }
    },
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

export const {setUser, logout, addError, clearErrors} = userSlice.actions
export const {selectUser, selectErrors} = userSlice.selectors
export default userSlice.reducer