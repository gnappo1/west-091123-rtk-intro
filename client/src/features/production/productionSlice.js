import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import { checkToken, getToken } from "../../utility/main";
export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})

const initialState = {
    data: null,
    errors: [],
    editMode: false,
    spotlight: null,
    loading: true
}
const fetchAll = async (thunkAPI) => {
    console.log("🚀 ~ file: productionSlice.js:13 ~ thunkAPI:", thunkAPI)
    try {
        const resp = await fetch("/productions")
        const data = await resp.json()
        if (resp.ok) {
            return data
        } else {
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const fetchOne = async (prod_id, asyncThunk) => {
    try {
        const resp = await fetch(`/productions/${prod_id}`)
        const data = await resp.json()
        if (resp.ok) {
            return data
        } else {
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}

const deleteFetchProduction = async (prod_id, asyncThunk) => {
    try {
        const respCheckToken = await checkToken()
        if (respCheckToken.ok) {
            const resp = await fetch(`/productions/${prod_id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            })
            if (resp.ok) { //! 204
                return prod_id //! should be nothing (no response body)
            } else {
                const data = await resp.json()
                throw data.message || data.msg
            }
        } else {
            const data = await respCheckToken.json()
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}
const patchFetchProduction = async (prod_id, formData, asyncThunk) => {
    try {
        const respCheckToken = await checkToken()
        if (respCheckToken.ok) {
            const resp = await fetch(`/productions/${prod_id}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            })
            const data = await resp.json()
            if (resp.ok) {
                return data
            } else {
                throw data.message || data.msg
            }
        } else {
            const data = await respCheckToken.json()
            throw data.message || data.msg
        }
    } catch (error) {
        return error
    }
}
const productionSlice = createSlice({
    name: "production",
    initialState,
    reducers: (create) => ({
        setProductions: create.reducer((state, action) => {
            state.data = action.payload
            state.loading = false
        }),
        setProduction: create.reducer((state, action) => {
            state.spotlight = action.payload
            state.loading = false
        }),
        addProduction: create.reducer((state, action) => {
            state.data.push(action.payload)
        }),
        updateProduction: create.reducer((state, action) => {
            const updateProdIndex = state.data.findIndex(production => production.id === action.payload)
            state.data[updateProdIndex] = action.payload
        }),
        setEditMode: create.reducer((state, action) => {
            state.editMode = action.payload
        }),
        deleteProduction: create.reducer((state, action) => {
            const deleteProdIndex = state.data.findIndex(production => production.id === action.payload)
            state.data.splice(deleteProdIndex, 1)
        }),
        addError: create.reducer((state, action) => {
            state.errors.push(action.payload)
        }),
        clearErrors: create.reducer((state) => {
            state.errors = []
        }),
        fetchAllProductions: create.asyncThunk(
            fetchAll,
            {
                pending: (state) => {
                    state.loading = true
                    state.errors = []
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    state.data = action.payload
                },
            }
        ),
        fetchOneProduction: create.asyncThunk(
            fetchOne,
            {
                pending: (state) => {
                    state.errors = []
                    state.loading = true
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    state.spotlight = action.payload
                },
            }
        ),
        fetchDeleteProduction: create.asyncThunk(
            deleteFetchProduction,
            {
                pending: (state) => {
                    state.errors = []
                    state.loading = true
                },
                rejected: (state, action) => {
                    state.loading = false
                    state.errors.push(action.payload)
                },
                fulfilled: (state, action) => {
                    state.loading = false
                    state.data.splice(state.data.findIndex(production => production.id === parseInt(action.payload)), 1)
                    state.spotlight = null
                },
            }
        )
    }),
    extraReducers: (builder) => {
        builder.addCase('user/fetchRegister/fulfilled', (state, action) => {
            debugger
        })
    },
    selectors: {
        selectProductions(state){
            return state.data
        },
        selectErrors(state){
            return state.errors
        },
        selectProductionById: (state, prod_id) => {
            return state.data.find(production => production.id === prod_id)
        }
    }
})

export const {setProductions, setProduction, setEditMode, addProduction, updateProduction, deleteProduction, addError, clearErrors, fetchAllProductions, fetchOneProduction, fetchDeleteProduction} = productionSlice.actions
export const {selectProductions, selectErrors} = productionSlice.selectors
export default productionSlice.reducer