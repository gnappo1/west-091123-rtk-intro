import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    errors: [],
    editMode: false,
    spotlight: null,
    loading: true
}

const productionSlice = createSlice({
    name: "production",
    initialState,
    reducers: {
        setProductions(state, action){
            state.data = action.payload
            state.loading = false
        },
        setProduction(state, action){
            state.spotlight = action.payload
            state.loading = false
        },
        addProduction(state, action){
            state.data.push(action.payload)
        },
        updateProduction(state, action) {
            const updateProdIndex = state.data.findIndex(production => production.id === action.payload)
            state.data[updateProdIndex] = action.payload
        },
        setEditMode(state, action){
            state.editMode = action.payload
        },
        deleteProduction(state, action){
            const deleteProdIndex = state.data.findIndex(production => production.id === action.payload)
            state.data.splice(deleteProdIndex, 1)
        },
        addError(state, action){
            state.errors.push(action.payload)
        },
        clearErrors(state){
            state.errors = []
        }
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

export const {setProductions, setProduction, setEditMode, addProduction, updateProduction, deleteProduction, addError, clearErrors} = productionSlice.actions
export const {selectProductions, selectErrors} = productionSlice.selectors
export default productionSlice.reducer