import React, {useState} from 'react'
import styled from "styled-components";
import { useFormik } from "formik"
import * as yup from "yup"
import {useDispatch} from 'react-redux'
import {fetchRegister} from './userSlice'
import { setToken, setRefreshToken } from '../../utility/main';

function Authentication({fetchProductions}) {
    const [signUp, setSignUp] = useState(false)
    const dispatch = useDispatch()

    const handleClick = () => setSignUp((signUp) => !signUp)
    const signupSchema = yup.object().shape({
        username: yup.string()
            .required("Please enter a user name"),
        email: yup.string()
            .email("Must be a valid email")
            .required("Please enter a user email"),
        password: yup.string()
            .required('Please enter a user password') 
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(/[a-zA-Z0-9]/, 'Password can only contain Latin letters and numbers.')
    })
    const loginSchema = yup.object().shape({
        email: yup.string()
            .email("Must be a valid email")
            .required("Please enter a user email"),
        password: yup.string()
            .required('Please enter a user password') 
    })
    const url = signUp ? "/signup" : "/login"

    const formik = useFormik({
        initialValues: {
            username:'',
            email:'',
            password:''
        },
        validationSchema: signUp ? signupSchema : loginSchema,
        onSubmit: (values) => dispatch(fetchRegister({url, values})).then((action) => {
            setToken(action.payload.jwt_token)
            setRefreshToken(action.payload.refresh_token)
        })
    })

    return (
        <> 
            <div id="register-switch">
                <h2>Please Log in or Sign up!</h2>
                <h3>{signUp?'Already a member?':'Not a member?'}</h3>
                <button onClick={handleClick}>{signUp?'Log In!':'Register now!'}</button>
            </div>
            <Form onSubmit={formik.handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input type='text' name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors.email && formik.touched.email ? <div className="error-message show">{formik.errors.email}</div> : null}
                {signUp &&(
                    <>
                        <label htmlFor='username'>Username</label>
                        <input type='text' name='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.username && formik.touched.username ? <div className="error-message show">{formik.errors.username}</div> : null}
                    </>
                )}
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.errors.password && formik.touched.password ? <div className="error-message show">{formik.errors.password}</div> : null}
                <input type='submit' value={signUp?'Sign Up!':'Log In!'} />
            </Form>
        </>
    )
}

export default Authentication

export const Form = styled.form`
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