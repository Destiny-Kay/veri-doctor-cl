import { emailValid } from "../utils/validators";
import './Login.css'
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/requestHandler";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";


export function ResetPass(props){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({email: ''})
    const [submitting, setSubmitting] = useState(false)
    const [codeSent, setCodeSent] = useState(true)
    const handleSubmit = (event) => {
        event.preventDefault()
        setSubmitting(true)
        if (emailValid(formData.email) == false) {
            setSubmitting(false)
            return toast.error('email is invalid')
        }
        api.post('reset-password', formData)
        .then((response) => {
            if (response.status === 200) {
                toast.success('Reset code successfully sent to your email address')
                setSubmitting(false)
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

    // TOO: finish up pass reset

    return(
        <>
            <Toaster richColors position="top-center" expand={false}/>
            <div className="form">
                <form method='post' onSubmit={handleSubmit}>
                    <div>
                        <p className="blue-heading">Enter email to reset password</p>
                        <label className='form-label'>
                                Email
                                <input required className='form-input' name="email" autoComplete="yes" onChange={handleChange}></input>
                        </label>
                        {
                            !submitting ?
                                <button className='submit-button' onClick={() => {
                                    handleSubmit()
                                }}>Send code</button>
                                :
                                <button className="loading-btn">Submitting...</button>
                        }
                    </div>
                </form>
            </div>
        </>
    )
}