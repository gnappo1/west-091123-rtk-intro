// 📚 Review With Students:
    // Request response cycle
    //Note: This was build using v5 of react-router-dom
import { Route, Switch, useHistory } from 'react-router-dom'
import { addError, clearErrors, setUser as reduxSetUser} from './features/user/userSlice'
import { setProductions} from './features/production/productionSlice'
import { useDispatch, useSelector } from 'react-redux'
import {createGlobalStyle} from 'styled-components'
import {useEffect, useState, useCallback} from 'react'
import { getToken, getRefreshToken, setToken } from './utility/main'
import Home from './components/Home'
import ProductionForm from './features/production/ProductionForm'
import ProductionEdit from './features/production/ProductionEdit'
import Navigation from './components/Navigation'
import ProductionDetail from './features/production/ProductionDetail'
import Authentication from './features/user/Authentication'
import NotFound from './components/NotFound'
import "./App.css"


function App() {
  // const [error, setError] = useState("");
  // const [productions, setProductions] = useState([])
  const [production_edit, setProductionEdit] = useState(false)
  // const [user, setUser] = useState(null);
  const user = useSelector(state => state.user.data)
  const errors = useSelector(state => state.user.errors)
  const history = useHistory()
  const dispatch = useDispatch()

  // const updateUser = (user) => setUser(user)

  const fetchProductions = () => {
    fetch("/productions")
    .then(response => {
      if (response.ok) {
        response.json().then(prods => dispatch(setProductions(prods)))
      } else {
        response.json().then(errorObj => dispatch(addError(errorObj.message || errorObj.msg)))
      }
    })
    .catch(error => dispatch(addError(error)))
  }

  useEffect(() => {
    if (!user) {
      //! ask the API if they know who we are with the jwt token from localStorage
      fetch("/me", {
        headers: {
          "Authorization": `Bearer ${getToken()}` //! as specified in the docs
        }
      })
      .then(res => {
        if (res.ok) { //! token is valid
          res.json().then(user => {
            // updateUser(user)
            dispatch(reduxSetUser(user))
          }).then(fetchProductions)
        } else if (res.status === 401) { //! token is invalid but maybe refresh token is still valid
          fetch("/refresh", {
            method: "POST",
            headers: {
              //! NOTICE HERE I send the refresh token since I know the access token is expired
              "Authorization": `Bearer ${getRefreshToken()}`
            }
          })
          .then(res => {
            if (res.ok) { //! refresh token was still valid
              res.json().then(respObj => {
                //! update the user
                // updateUser(respObj.user)
                dispatch(reduxSetUser(respObj.user))
                //! update the expired token in localStorage with the newly created token coming from the API  
                setToken(respObj.jwt_token)
              }).then(fetchProductions)
            } else {
              res.json().then(errorObj => dispatch(addError(errorObj.msg)))
            }
          })
        } else { //! both tokens are invalid
          res.json().then(errorObj => dispatch(addError(errorObj.msg || errorObj.msg)))
        }
      })
      .catch(error => dispatch(addError(error)))
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
      <Authentication fetchProductions={fetchProductions}/>
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
