import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { emailValid } from "../utils/validators"
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { api } from '../lib/requestHandler'
import { useUser } from "../context/UserContext";
import './Login.css'
import { Toaster } from "sonner";

export function Login(props) {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { setUserId } = useUser()
    const {setUserData} = useUser()
    const [isDisabled, setIsDisabled] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (event) => {
        const {name,  value} = event.target
        setFormData({
            ...formData, [name]: value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsDisabled(true)
        if (emailValid(formData.email) == false) {
            setIsDisabled(false)
            return toast.error('enter a valid email')
        }
        const payload = {
            "email": formData.email,
            "password": formData.password
        }

        api.post('login', payload)
        .then((response) => {
            if (response.status === 200) {
                const user_id = response.data.id
                const a_token = response.data.a_token
                const user_type = response.data.type
                setUserId(user_id)
                setUserData(user_type)
                localStorage.setItem('user_id', JSON.stringify(user_id))
                localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                localStorage.setItem('user_data', JSON.stringify(user_type))
                toast.success('Success')
                const redirect_url = searchParams.get('rdrct')
                if (redirect_url) {
                    navigate(`${redirect_url}`)
                }
                else {
                    if (user_type === 'doctor') {
                        navigate('/doc/dashboard')
                    }
                    else {
                        navigate('/usr/dashboard')
                    }
                }
            }
        }).catch((error) => {
            if (error.response && error.response.status === 403) {
                setIsDisabled(false)
                toast.error('password or email is incorrect')
            }
            else if (error.response && error.response.status === 404) {
                setIsDisabled(false)
                toast.error("user not found")
            }
            else {
                setIsDisabled(false)
                toast.error('An error occurred on the server')
            }
        })
    }

    return (
            <>
                <Toaster richColors position="top-center" expand={false}/>
                <form className='form' method='post' onSubmit={handleSubmit}>
                    <div>
                        <p className="blue-heading">Login to your account</p>
                        <label className='form-label'>
                            Email
                            <input required className='form-input' name="email" autoComplete="no" onChange={handleChange}></input>
                        </label>
                        <label className='form-label'>
                            Password
                            <input type='password' required className='form-input' name="password" onChange={handleChange}></input>
                        </label>
                        <Link to={`/auth/reset-password`}><p>Forgot password?</p></Link>
                        
                        {isDisabled ?  
                            <button className={`loading-btn`}>Loading...</button> : 
                            <button className={`submit-button`} disabled={isDisabled}>Login</button>
                        }
                        <Link to={`/auth/signup`}><p>Don&apos;t have an account? Signup</p></Link>
                    </div>
                </form>
            </>
    )
}
