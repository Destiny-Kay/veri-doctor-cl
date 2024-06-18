import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'
import { toast } from "sonner";
import { emailValid } from "../utils/validators";
import { api } from '../lib/requestHandler'
import { Toaster } from "sonner";

export function Signup(props){
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [ formData, setFormData ] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: ''
    })
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData, [name]: value
        })
    }

    const validateForm = (data) => {
        if (
            data.firstName != ''
            && data.lastName != ''
            && emailValid(data.email) !=false
            && data.phone.length === 10
            && data.password === data.passwordConfirm
        ) {
            return true
        } else {
            return false
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsDisabled(true)

        if (validateForm(formData) === false) {
            setIsDisabled(false)
            return toast.error('some data is miissing or is invalid, please provide valid details')
        }

        const payload = {
            "first_name": formData.firstName,
            "last_name": formData.lastName,
            "email": formData.email,
            "phone_number": formData.phone,
            "password": formData.password
        }

        api.post('signup', payload)
        .then((response) => {
            if (response.status === 201) {
                toast.success('Your account has been created successfully. proceed to login')
                navigate('/auth/login')
            }
        }).catch((error) => {
            if (error.response  && error.response.status == 400) {
                setIsDisabled(false)
                return toast.error('Details you provided are invalid or your phone number or email has an account already')
            }
            return toast.error(`An error occured while submitting your data. Try again later`)
        })
    }

    return (
        <>
            <Toaster richColors position="top-center" expand={false}/>
            <form className="form" method='post' onSubmit={handleSubmit}>
                <div>
                    <p className="blue-heading">Welcome to veridoctor</p>
                    <label className='form-label'>
                        First name
                        <input className={`form-input`} placeholder='John' name="firstName" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            formData.firstName != '' ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')
                        }}></input>
                    </label>
                    <label className='form-label'>
                        Last name
                        <input  className={`form-input`} placeholder='Doe' name="lastName" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            formData.lastName != '' ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')
                        }}></input>
                    </label>
                    <label className='form-label'>
                        email
                        <input  className={`form-input`} placeholder='johndoe@email.com' name="email" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            emailValid(formData.email) ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')}
                            }>
                        </input>
                    </label>
                    <label className='form-label'>
                        Phone number
                        <input  className='form-input'  placeholder='0712345678' name="phone" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            if (formData.phone.length != 10) {
                                e.target.classList.add('red-input')
                            } else {e.target.classList.remove('red-input')}
                        }}></input>
                    </label>
                    <label className='form-label'>
                        Password
                        <input type='password' required className={`form-input ${formData.password === formData.passwordConfirm ? '' : 'red-input'}`} name="password" onChange={handleChange} id="password"></input>
                    </label>
                    <label className='form-label'>
                        Confirm Password
                        <input type='password' required className='form-input' name="passwordConfirm" onChange={handleChange} id="repeatpass"></input>
                    </label>
                    <div className="checkbox-wrapper">
                        <label>
                            <input type="checkbox" id="check" onClick={() => {setAgreedToTerms(prev => !prev)}}></input>
                            Agree to all <Link to={'/policies/tos'}>terms and conditions</Link> and our <Link to={'/policies/tos'}>privacy policy</Link>
                        </label>
                    </div>
                    {isDisabled ?  
                        <button className={`loading-btn`}>Loading...</button> :
                        agreedToTerms ?
                            <button className={`submit-button`} disabled={isDisabled}>create account</button>
                            :
                            <></>
                    }
                    <Link to={`/auth/login`}><p>Have an account?</p></Link>
                </div>
            </form>
        </>
    )
}
