import { emailValid } from "../utils/validators";
import './Login.css'
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/requestHandler";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";


export function ResetPass(props){
    const [formData, setFormData] = useState({email: ''})
    const [submitting, setSubmitting] = useState(false)
    const [codeSent, setCodeSent] = useState(false)
    const [verifiedCode, setVerifiedCode] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = () => {
        // event.preventDefault()
        setSubmitting(true)
        if (emailValid(formData.email) == false) {
            setSubmitting(false)
            return toast.error('email is invalid')
        }

        api.post(`reset-password`, formData)
        .then((response) => {
            if (response.status === 200) {
                toast.success('Reset code successfully sent to your email address')
                setSubmitting(false)
                setCodeSent(true)
            }
        }).catch((error) => {
            setSubmitting(false)
            if (error.response.status === 404) {
                toast.error('The email address provided does not have an account')
            }
            else {
                toast.error('An error occurred while sending your code, please try again later')
            }
            
        })
    }

    const handleChange = (event) => {
        const {name,  value} = event.target
        setFormData({
            ...formData, [name]: value
        })
    }

    const confirmCode = (event) => {
        event.preventDefault()
        api.post(`reset-password/confirm-code`, formData)
        .then((response) => {
            if (response.status === 200) {
                toast.success('Code confirmation successful')
                setVerifiedCode(true)
                // setSubmitting(false)
            }
        }).catch((error) => {
            // setSubmitting(false)
            if (error.response.status === 404) {
                return toast.error('The email address provided does not have an account')
            }
            if (error.response.status === 400) {
                return toast.error(error.response.data.error)
            }
            else {
                toast.error('An error occurred while sending your code, please try again later')
            }
            
        })
    }

    const handleResetPassword = () => {
        if (formData.password !== formData.confirmpass) {
            return toast.error('passwords do not match')
        }
        api.post(`reset-password/reset`, formData)
        .then((response) => {
            if (response.status === 200) {
                toast.success('Password reset successful')
                navigate('/auth/login')
            }
        }).catch((error) => {
            if (error.response.status === 404) {
                return toast.error('something went wrong while submitting the data')
            }
            if (error.response.status === 400) {
                return toast.error(error.response.data.error)
            }
            else {
                toast.error('An error occurred while resetting your password, please try again later')
            }
            
        })
    }


    return(
        <>
            <Toaster richColors position="top-center" expand={false}/>
            <div className="form">
                {/* <form method='post'> */}
                    <div>
                        <p className="blue-heading">Reset password</p>
                        
                        {
                            codeSent ?
                            <>
                                {
                                    !verifiedCode &&
                                    <label className='form-label'>
                                    Enter the 4 digit code sent to your email
                                    <input className='form-input' name="code" onChange={handleChange} maxLength={4}></input>
                                    </label>

                                }
                                {
                                    !submitting ?
                                    <>
                                    {
                                        !verifiedCode &&
                                        <>
                                        <p className="resend-link" onClick={handleSubmit}>Resend code</p>
                                    
                                        <button className="submit-button" onClick={confirmCode}>Confirm</button>
                                        </>
                                    }
                                    </>
                                    :
                                    <p className="resend-link">Resending code...</p>
                                }
                                {
                                    verifiedCode
                                    &&
                                    <>
                                        <label>Password
                                            <input className={`form-input ${formData.password === formData.confirmpass ? '' : 'red-input'}`} name='password' type='password' onChange={handleChange}></input>
                                        </label>
                                        <label>
                                            Confirm Password
                                            <input className={`form-input`} name="confirmpass" type='password' onChange={handleChange}></input>
                                        </label>
                                        <button className="submit-button" onClick={handleResetPassword}>reset password</button>
                                    </>
                                }
                            </>
                            :
                            <>
                            
                            {
                                !submitting ?
                                    <>
                                        <label className='form-label'>
                                            Email
                                            <input required className='form-input' name="email" autoComplete="yes" onChange={handleChange}></input>
                                        </label>
                                        <button className='submit-button' onClick={() => {
                                            handleSubmit()
                                        }}>Send code</button>
                                    </>
                                    :
                                    <button className="loading-btn">Submitting...</button>
                            }
                            </>
                        }
                    </div>
                {/* </form> */}
            </div>
        </>
    )
}