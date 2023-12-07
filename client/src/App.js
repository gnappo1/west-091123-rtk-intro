// 📚 Review With Students:
    // Request response cycle
    //Note: This was build using v5 of react-router-dom
import { Route, Switch } from 'react-router-dom'
import { clearErrors } from './features/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import {createGlobalStyle} from 'styled-components'
import { fetchAllProductions } from './features/production/productionSlice'
import { fetchCurrentUser } from './features/user/userSlice'
import {useEffect } from 'react'
import Home from './components/Home'
import ProductionForm from './features/production/ProductionForm'
import ProductionEdit from './features/production/ProductionEdit'
import Navigation from './components/Navigation'
import ProductionDetail from './features/production/ProductionDetail'
import Authentication from './features/user/Authentication'
import NotFound from './components/NotFound'
import "./App.css"
import { setToken } from './utility/main'


function App() {
  const user = useSelector(state => state.user.data)
  const errors = useSelector(state => state.user.errors)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      //! ask the API if they know who we are with the jwt token from localStorage
      dispatch(fetchCurrentUser()).then((action) => {
        if (action.payload.flag === "refresh") {
          setToken(action.payload.jwt_token)
        }
        dispatch(fetchAllProductions())
      })
    }
  }, [user])

  useEffect(() => {
    if (errors.length) {
      const timeout = setTimeout(() => dispatch(clearErrors("")), 3000)
      return () => {
        clearTimeout(timeout)
      };
    }
  }, [errors]);

  if(!user) return (
    <>
      <GlobalStyle />
      <Navigation/>
      <div>{errors.join(";\n")}</div>
      <Authentication />
    </>
  )
  return (
    <>
    <GlobalStyle />
    <Navigation />
    <div>{errors.join(";\n")}</div>
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
