import  {useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {setEditMode} from './productionSlice'
import { useFetchProductionQuery, useFetchDeleteProductionMutation } from '../../services/productionApi'
import styled from 'styled-components'
import NotFound from '../../components/NotFound'
import { toast } from 'react-hot-toast';
import Spinner from '../../components/Spinner'
import { logout } from '../user/userSlice'
import { useFetchTokensMutation } from '../../services/auth_api'

function ProductionDetail() {
  const {prod_id} = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const {data, error, isLoading } = useFetchProductionQuery(parseInt(prod_id))
  const [deleteProduction, {result, isLoading: deleteIsLoading, error: deleteError}] = useFetchDeleteProductionMutation()
  const [checkTokens, {result: tokenResult}]  = useFetchTokensMutation()


  const handleDelete = async () => {
    const tokenAction = await checkTokens()
    const validRefreshToken = typeof tokenAction.data === "string"
    const validAccessToken = tokenAction.data && tokenAction.data.message && tokenAction.data.message === 'Valid Token'
    if ((validAccessToken || validRefreshToken)){
      const result = await deleteProduction(prod_id)
      if (prod_id === result.data) {
        history.push("/")
      }
    } else {
      //! Log user out if tokens are both expired
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("refresh_token")
      dispatch(logout())
    }
  }

  const handleEdit = () => {
    dispatch(setEditMode(true))
    history.push(`/productions/edit/${data.id}`)
  }

  if (error) {
    return <NotFound />
  }
  if (isLoading) {
    return <Spinner loading={isLoading} />
  }

  const {id, title, genre, image,description, crew_members} = data 

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