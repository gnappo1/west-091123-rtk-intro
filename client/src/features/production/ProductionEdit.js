import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProduction, addError } from './productionSlice'
import { useFormik } from "formik"
import * as yup from "yup"
import { getToken, setToken } from '../../utility/main'



function ProductionFormEdit() {
  //Student Challenge: GET One 
  const history = useHistory()
  const dispatch = useDispatch()
  const production = useSelector(state => state.production.spotlight)
  // 7.✅ Use yup to create client side validations
  const productionSchema = yup.object().shape({
    title: yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be at most 50 characters')
      .required('Title is required'),
    genre: yup.string()
      .oneOf(['Drama', 'Musical', 'Opera'])
      .required('Genre is required'),
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
        "Authorization": `Bearer ${getToken()}`
      }
    })
  }

  const {id, title, genre, budget, image, director, description, ongoing} = production
  // 8.✅ useFormik hook
  const formik = useFormik({
    initialValues: {
      title,
      genre,
      budget,
      image,
      director,
      description,
      ongoing
    },
    validationSchema: productionSchema,
    onSubmit: (values) => {}
  })

  if(!production) return <h2>Loading</h2>

  return (
      <div className='App'>
        <Form onSubmit={formik.handleSubmit}>
          <label>Title </label>
          <input type='text' name='title' value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.title && formik.touched.title ? <div className="error-message show">{formik.errors.title}</div> : null}
          <label> Genre</label>
          <input type='text' name='genre' value={formik.values.genre} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.genre && formik.touched.genre ? <div className="error-message show">{formik.errors.genre}</div> : null}
          <label>Budget</label>
          <input type='number' name='budget' value={formik.values.budget} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.budget && formik.touched.budget ? <div className="error-message show">{formik.errors.budget}</div> : null}
          <label>Image</label>
          <input type='text' name='image'  value={formik.values.image} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.image && formik.touched.image ? <div className="error-message show">{formik.errors.image}</div> : null}
          <label>Director</label>
          <input type='text' name='director' value={formik.values.director} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.director && formik.touched.director ? <div className="error-message show">{formik.errors.director}</div> : null}
          <label>Description</label>
          <textarea type='text' rows='4' cols='50' name='description' value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.errors.description && formik.touched.description ? <div className="error-message show">{formik.errors.description}</div> : null}
          <input type='submit' disabled={formik.isSubmitting} />
        </Form> 
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