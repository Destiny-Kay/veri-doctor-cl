import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { emailValid } from "../utils/validators";
import { api } from '../lib/requestHandler'
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import './Login.css'
import { Toaster } from "sonner";


export function DocSignup(props){
    const navigate = useNavigate()
    const [ formData, setFormData ] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        title: '',
        licence_number: '',
        specialty: '',
        sub_specialty: '',
    })
    const [isDisabled, setIsDisabled] = useState(false)
    const [specialties, setSpecialties] = useState(null)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    useEffect(() => {
        fetchSpecialties()
    }, [])

    const fetchSpecialties = async () => {
        api.get('specialties')
        .then((response) => {
            if (response.status == 200){
                const jsonData = response.data
                setSpecialties(jsonData)
            }
            }
        ).catch((error) =>{
            toast.error('Something went wrong while fetching specialties.')
        })
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData, [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsDisabled(true)
        
        const payload = {
            "first_name": formData.firstName,
            "last_name": formData.lastName,
            "email": formData.email,
            "phone_number": formData.phone,
            "password": formData.password,
            "title": formData.title,
            "licence_number": formData.licence_number,
            "specialty": formData.specialty,
            "sub_specialty": formData.sub_specialty
        }
        api.post('signup-doc', payload)
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
            setIsDisabled(false)
            return toast.error(`An error occured while submitting your data. Try again later`)
        })
    }

    return(
        <>
        <Toaster richColors position="top-center" expand={false}/>
        <form className="form" method='post' onSubmit={handleSubmit}>
                <div>
                    <p className="blue-heading">Join as a doctor</p>
                    <label className="form-label">
                    Title
                        <select name="title" onChange={handleChange}>
                            <option value="">Select a title...</option>
                            <option value="Dr.">Dr.</option>
                            <option value="Prof.">Prof.</option>
                        </select>
                    </label>
                    <label className='form-label'>
                        First name
                        <input required className={`form-input`} placeholder='John' name="firstName" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            formData.firstName != '' ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')
                        }}></input>
                    </label>
                    <label className='form-label'>
                        Last name
                        <input required className={`form-input`} placeholder='Doe' name="lastName" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            formData.lastName != '' ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')
                        }}></input>
                    </label>
                    <label className='form-label'>
                        email
                        <input required className={`form-input`} placeholder='johndoe@email.com' name="email" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            emailValid(formData.email) ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')}
                            }>
                        </input>
                    </label>
                    <label className='form-label'>
                        Phone number
                        <input required className='form-input'  placeholder='0712345678' name="phone" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            if (formData.phone.length != 10) {
                                e.target.classList.add('red-input')
                            } else {e.target.classList.remove('red-input')}
                        }}></input>
                    </label>
                    <label className='form-label'>
                        Licence number
                        <input required className='form-input'  placeholder='' name="licence_number" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            formData.licence_number != '' ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')
                        }}></input>
                    </label>
                    <label className='form-label'>
                        specialty
                        <select name="specialty" onChange={handleChange}>
                            <option value="">Select specialty...</option>
                            {specialties ? (
                                specialties.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))
                            ): (<option>Loading data...</option>)}
                        </select>
                    </label>
                    <label className='form-label'>
                        Sub specialty
                        <input required className='form-input'  placeholder='Pedriatic cardiology' name="sub_specialty" autoComplete="true" onChange={handleChange} onBlur={(e) => {
                            formData.sub_specialty != '' ? e.target.classList.remove('red-input') : e.target.classList.add('red-input')
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
                            I agree to all <Link to={'/policies/tos'}>terms and conditions</Link> and the <Link to={'/policies/doctorspp'}>doctor&apos;s privacy policy</Link>
                        </label>
                    </div>
                    {isDisabled ?  
                        <button className={`loading-btn`}>Loading...</button> :
                        agreedToTerms ? 
                            <button className={`submit-button`} disabled={isDisabled}>create account</button>
                            :
                            <></>
                    }
                    <Link to={`/auth/login`}><p>Have an account?Login</p></Link>
                </div>
            </form>
        </>
    )
}
