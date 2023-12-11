// 📚 Review With Students:
    // Request response cycle
    //Note: This was build using v5 of react-router-dom
import { Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {createGlobalStyle} from 'styled-components'
import { fetchCurrentUser } from './features/user/userSlice'
import {useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Home from './components/Home'
import ProductionForm from './features/production/ProductionForm'
import ProductionEdit from './features/production/ProductionEdit'
import Navigation from './components/Navigation'
import ProductionDetail from './features/production/ProductionDetail'
import Authentication from './features/user/Authentication'
import NotFound from './components/NotFound'
import "./App.css"
import { Toaster } from 'react-hot-toast';
import { useFetchCurrentUserQuery } from './services/userApi'
import { useFetchProductionsQuery } from './services/productionApi'
import useBounceUsers from './hooks/hooks'
function App() {
  const dispatch = useDispatch()
  const location = useLocation()  
  const user = useSelector(state => state.user.data)
  const { data: userData, error: userError, isLoading: userIsLoading } = useFetchCurrentUserQuery({
    skip: !user
  })
  console.log("🚀 ~ file: App.js:29 ~ App ~ userData:", userData)
  const [bounce] = useBounceUsers(location.pathname)

  useEffect(() => {
    if (!user) {
      bounce()
    }
  }, [user, bounce]);


  return (
    <>
      <GlobalStyle />
      <Navigation />
      <Toaster />
      <Switch>
        <Route path='/productions/new'>
          <ProductionForm />
        </Route>
        <Route  path='/productions/edit/:prod_id'>
          <ProductionEdit />
        </Route>
        <Route path='/productions/:prod_id'>
            <ProductionDetail />
        </Route>
        <Route exact path='/register'>
          <Authentication />
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
