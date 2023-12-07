import  {useParams, useHistory } from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {deleteProduction, setProduction, addError, setEditMode} from './productionSlice'
import {getToken, getRefreshToken, setToken} from '../../utility/main'
import styled from 'styled-components'
import NotFound from '../../components/NotFound'

function ProductionDetail() {
  // const [production, setProduction] = useState({crew_members:[]})
  // const [error, setError] = useState(null)
  //Student Challenge: GET One 
  const production = useSelector(state => state.production.spotlight)
  const {prod_id} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(()=>{
    fetch(`/productions/${prod_id}`)
    .then(response => {
      if (response.ok){ //! if it's in 200-299 range
        response.json().then(production => dispatch(setProduction(production)))
      } else {
        response.json().then(errorObj => dispatch(addError(errorObj.message)))
      }
    })
    .catch(error => dispatch(addError(error)))
  },[prod_id])

  const checkToken = () => fetch("/check", {
    headers: {
      //! NOTICE HERE I send the refresh token since I know the access token is expired
      "Authorization": `Bearer ${getToken()}`
    }
  })

  const postRefreshToken = () => {
    return fetch("/refresh", {
      method: "POST",
      headers: {
        //! NOTICE HERE I send the refresh token since I know the access token is expired
        "Authorization": `Bearer ${getRefreshToken()}`
      }
    })
  }

  const deleteFetchProduction = () => {
    return fetch(`/productions/${prod_id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    .then(response => {
      if (response.ok){ //! 204
        dispatch(deleteProduction(prod_id))
        history.push("/")
      } else {
        response.json().then(errorObj => dispatch(addError(errorObj.message)))
      }
    })
    .catch(error => dispatch(addError(error)))
  }

  const handleDelete = () => {
    checkToken() //! make sure token is still valid
    .then(resp => {
      if (resp.ok) {
        deleteFetchProduction() //! try to fire a DELETE with a valid token
      } else if (resp.status === 401) { //! token is invalid but maybe refresh token is still valid
        postRefreshToken() //! try to refresh the token
        .then(res => {
          if (res.ok) { //! refresh token was still valid
            res.json().then(respObj => {
              //! update the expired token in localStorage with the newly created token coming from the API  
              setToken(respObj.jwt_token)
            })
            .then(deleteFetchProduction) //! try again to fire the DELETE now that a new token has been issued
          } else {
            res.json().then(errorObj => dispatch(addError(errorObj.msg)))
          }
        })
      }
    })
    .catch(error => dispatch(addError(error)))
  }

  const handleEdit = () => {
    dispatch(setEditMode(true))
    history.push(`/productions/edit/${production.id}`)
  }
  if (!production) {
    return <NotFound />
  }
  const {id, title, genre, image,description, crew_members} = production 
  // if(error) return <h2>{error}</h2>
  return (
      <CardDetail id={id}>
        <h1>{title}</h1>
          <div className='wrapper'>
            <div>
              <h3>Genre:</h3>
              <p>{genre}</p>
              <h3>Description:</h3>
              <p>{description}</p>
              <h2>Cast Members</h2>
              <ul>
                {crew_members && crew_members.map(cast => <li key={cast.id}>{`${cast.role} : ${cast.name}`}</li>)}
              </ul>
            </div>
            <img src={image} alt={title}/>
          </div>
      <button onClick={handleEdit} >Edit Production</button>
      <button onClick={handleDelete} >Delete Production</button>

      </CardDetail>
    )
  }
  
  export default ProductionDetail
  const CardDetail = styled.li`
    display:flex;
    flex-direction:column;
    justify-content:start;
    font-family:Arial, sans-serif;
    margin:5px;
    h1{
      font-size:60px;
      border-bottom:solid;
      border-color:#42ddf5;
    }
    .wrapper{
      display:flex;
      div{
        margin:10px;
      }
    }
    img{
      width: 300px;
    }
    button{
      background-color:#42ddf5;
      color: white;
      height:40px;
      font-family:Arial;
      font-size:30px;
      margin-top:10px;
    }
  `