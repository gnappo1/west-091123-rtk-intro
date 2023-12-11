import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatchProduction } from './productionSlice'
import { Formik } from "formik"
import * as yup from "yup"
import NotFound from '../../components/NotFound'
import { toast } from 'react-hot-toast';
import { useFetchPatchProductionMutation, useFetchProductionQuery } from '../../services/productionApi';
import { useFetchTokensMutation } from '../../services/auth_api';
import { logout } from '../user/userSlice';
import Spinner from '../../components/Spinner'


function ProductionFormEdit() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { prod_id } = useParams()
  console.log("🚀 ~ file: ProductionEdit.js:20 ~ ProductionFormEdit ~ prod_id:", prod_id)
  const [patchProduction, {result: productionResult}] = useFetchPatchProductionMutation()
  const [checkTokens, {result: tokenResult}]  = useFetchTokensMutation()
  const {data, error, isLoading } = useFetchProductionQuery(parseInt(prod_id))

  // 7.✅ Use yup to create client side validations
  const productionSchema = yup.object().shape({
    title: yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be at most 50 characters')
      .required('Title is required'),
    // genre: yup.string()
    //   .oneOf(['Drama', 'Musical', 'Opera'])
    //   .required('Genre is required'),
    budget: yup.number()
      .positive('Budget must be a positive number')
      .max(1000000000, 'Budget must be less than 1 billion')
      .required('Budget is required'),
    image: yup.string()
      .test('is-url', 'Image must be a valid URL', (value) => {
        const urlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/g;
        return urlRegex.test(value);
      })
      .required('Image is required'),
    director: yup.string()
      .test('at-least-two-words', 'Title must contain at least two words', (value) => {
        const wordCountRegex = /\b\w+\b/g;
        const words = value ? value.match(wordCountRegex) || [] : [];
        return words.length >= 2;
      })
      .required('Director is required'),
    description: yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be at most 1000 characters')
      .required('Description is required')
  })

  if(error) return <NotFound />
  if (isLoading) {
    return <Spinner loading={isLoading} />
  }
  
  const {id, title, genre, budget, image, director, description, ongoing} = data

  return (
      <div className='App'>
        <Formik
          initialValues={{ title, genre, budget, image, director, description, ongoing }}
          validationSchema={productionSchema}
          onSubmit={async (values) => {
            const tokenAction = await checkTokens()
            const validRefreshToken = typeof tokenAction.data === "string"
            const validAccessToken = tokenAction.data && tokenAction.data.message && tokenAction.data.message === 'Valid Token'
            if ((validAccessToken || validRefreshToken)){
              const patchAction = await patchProduction({values: {...values, ongoing: true}, prodId: prod_id})
              
              if (patchAction.data && patchAction.data.id) {
                history.push(`/productions/${patchAction.data.id}`)
              }
            } else {
              //! Log user out if tokens are both expired
              localStorage.removeItem("jwt_token")
              localStorage.removeItem("refresh_token")
              await dispatch(logout())
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <label>Title </label>
              <input type='text' name='title' value={values.title} onChange={handleChange} onBlur={handleBlur} />
              {errors.title && touched.title ? <div className="error-message show">{errors.title}</div> : null}
              <label> Genre</label>
              <input type='text' name='genre' value={values.genre} onChange={handleChange} onBlur={handleBlur} />
              {errors.genre && touched.genre ? <div className="error-message show">{errors.genre}</div> : null}
              <label>Budget</label>
              <input type='number' name='budget' value={values.budget} onChange={handleChange} onBlur={handleBlur} />
              {errors.budget && touched.budget ? <div className="error-message show">{errors.budget}</div> : null}
              <label>Image</label>
              <input type='text' name='image'  value={values.image} onChange={handleChange} onBlur={handleBlur} />
              {errors.image && touched.image ? <div className="error-message show">{errors.image}</div> : null}
              <label>Director</label>
              <input type='text' name='director' value={values.director} onChange={handleChange} onBlur={handleBlur} />
              {errors.director && touched.director ? <div className="error-message show">{errors.director}</div> : null}
              <label>Description</label>
              <textarea type='text' rows='4' cols='50' name='description' value={values.description} onChange={handleChange} onBlur={handleBlur} />
              {errors.description && touched.description ? <div className="error-message show">{errors.description}</div> : null}
              <input type='submit' disabled={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    )
  }
  
  export default ProductionFormEdit

  const Form = styled.form`
    display:flex;
    flex-direction:column;
    width: 400px;
    margin:auto;
    font-family:Arial;
    font-size:30px;
    input[type=submit]{
      background-color:#42ddf5;
      color: white;
      height:40px;
      font-family:Arial;
      font-size:30px;
      margin-top:10px;
      margin-bottom:10px;
    }
  `