// 📚 Review With Students:
    // Request response cycle
    //Note: This was build using v5 of react-router-dom
import { Route, Switch } from 'react-router-dom'
import { clearErrors as clearUserErrors} from './features/user/userSlice'
import { clearErrors as clearProductionErrors} from './features/production/productionSlice'
import { useDispatch, useSelector } from 'react-redux'
import {createGlobalStyle} from 'styled-components'
import { fetchAllProductions } from './features/production/productionSlice'
import { fetchCurrentUser } from './features/user/userSlice'
import {useEffect, useCallback } from 'react'
import Home from './components/Home'
import ProductionForm from './features/production/ProductionForm'
import ProductionEdit from './features/production/ProductionEdit'
import Navigation from './components/Navigation'
import ProductionDetail from './features/production/ProductionDetail'
import Authentication from './features/user/Authentication'
import NotFound from './components/NotFound'
import "./App.css"
import { setToken } from './utility/main'
import { Toaster } from 'react-hot-toast';


function App() {
  const user = useSelector(state => state.user.data)
  const userErrors = useSelector(state => state.user.errors)
  const productionErrors = useSelector(state => state.production.errors)
  const dispatch = useDispatch()
  const errors = [...userErrors, ...productionErrors]
  const clearErrorsAction = useCallback(() => {
    dispatch(clearUserErrors(""))
    dispatch(clearProductionErrors(""))
  }, [dispatch, clearUserErrors, clearProductionErrors]);

  useEffect(() => {
    (async () => {
      if (!user) {
        const action = await dispatch(fetchCurrentUser())
        if (typeof action.payload !== "string") {
          if (action.payload.flag === "refresh") {
            setToken(action.payload.jwt_token)
          }
          dispatch(fetchAllProductions())
        }
      }
    })()
  }, [user])

  useEffect(() => {
    if (errors.length) {
      clearErrorsAction()
      // const timeout = setTimeout(clearErrorsAction, 3000)
      // return () => {
      //   clearTimeout(timeout)
      // };
    }
  }, [errors, clearErrorsAction]);

  if(!user) return (
    <>
      <GlobalStyle />
      <Navigation/>
      <Toaster />
      <Authentication />
    </>
  )
  return (
    <>
      <GlobalStyle />
      <Navigation />
      <Toaster />
      <Switch>
        <Route path='/productions/new'>
          <ProductionForm />
        </Route>
        <Route  path='/productions/edit/:id'>
          <ProductionEdit />
        </Route>
        <Route path='/productions/:prod_id'>
            <ProductionDetail />
        </Route>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  )
}

export default App

const GlobalStyle = createGlobalStyle`
    body{
      background-color: black; 
      color:white;
    }
    `
