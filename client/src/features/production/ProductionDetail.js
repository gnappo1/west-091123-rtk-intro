import  {useParams, useHistory } from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {deleteProduction, setProduction, addError, setEditMode, fetchOneProduction, fetchDeleteProduction} from './productionSlice'
import {getToken, getRefreshToken, setToken, checkToken, postRefreshToken} from '../../utility/main'
import styled from 'styled-components'
import NotFound from '../../components/NotFound'

function ProductionDetail() {
  // const [production, setProduction] = useState({crew_members:[]})
  // const [error, setError] = useState(null)
  //Student Challenge: GET One 
  const production = useSelector(state => state.production.spotlight)
  const loading = useSelector(state => state.production.loading)
  const {prod_id} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(fetchOneProduction(prod_id))
  },[prod_id])


  const handleDelete = async () => {
      const {type, meta, payload} = await dispatch(fetchDeleteProduction(prod_id))
      if (meta.requestStatus === "fulfilled" && type === "production/fetchDeleteProduction/fulfilled") {
        history.push("/")
      }
  }

  const handleEdit = () => {
    dispatch(setEditMode(true))
    history.push(`/productions/edit/${production.id}`)
  }
  if (!production) {
    return <NotFound />
  }
  // if (loading) {
  //   return <h2>Loading...</h2>
  // }
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