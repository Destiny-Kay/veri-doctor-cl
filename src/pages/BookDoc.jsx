import approvedIcon from '../assets/approved.svg'
import './BookDoc.css'
import moneyIcon from '../assets/money.svg'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../lib/requestHandler'
import userAvatar from '../assets/user-avatar.svg'
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import { useUser } from '../context/UserContext'
import moment from 'moment'


export function BookDoc(props){
    const navigate = useNavigate()
    const {doc_id} = useParams()
    const [docInfo, setDocInfo] = useState(null)
    const [docProfile, setDocProfile] = useState(null)
    const [dateValue, setDateValue] = useState(null)
    const [timeslots, setTimeslots] = useState(null)
    const [isOpen, setIsopen] = useState(false)
    const [selectedTimeslot, setSelectedTimeslot] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    const [appointmentSuccess, setAppointmentSuccess] = useState(null)
    const {userId} = useUser()
    const {userData} = useUser()

    const [appointmentPayload, setAppointmentPayload] = useState({
        'date': dateValue,
        'time': null,
    })

    useEffect(() => {
        api.get(`doctors/${doc_id}`).then(
            (response) => {
                if (response.status === 200) {
                    setDocInfo(response.data)
                }
            }
        ).catch ((error) => {
            if (error.response.status === 404) {
                navigate('/doctors')
            }
        }
        )
    },[])

    useEffect(() => {
        api.get(`users/${userId}`).then(
            (response) => {
                if (response.status === 200) {
                    setUserDetails(response.data)
                }
            }
        )
    }, [])

    useEffect(() => {
        api.get(`doc-profile/${doc_id}`).then(
            (response) => {
                if (response.status === 200) {
                    setDocProfile(response.data)
                }
            }
        ).catch((error) => {
            if (error.response.status === 404) {
                setDocProfile(null)
            }
        })
    },[])

    useEffect(() => {
        api.get(`doctor/${doc_id}/timeslots?${dateValue ? "date=" + moment(dateValue).format("YYYY-MM-DD") : ''}`).then(
            (response) => {
                if (response.status === 200) {
                    setTimeslots(response.data)
                }
            }
        )
    },[dateValue])

    const handleDateChange = (newValue) => {
        setDateValue(newValue)
        if (newValue) {
            setAppointmentPayload({
                ...appointmentPayload, 'date': moment(newValue).format('YYYY-MM-DD')
            })
        }
    }

    const submitAppointment = (item, index) => {
        if (dateValue === null) {
            toast.error('Please select an appointment date first')
            return
        } else {
            setSelectedTimeslot(index)
            setAppointmentPayload({...appointmentPayload, 'time': item.id})
            setIsopen(true)
        }
    }

    const postAppointment = () => {
        api.post(`book/${doc_id}`, appointmentPayload, { withCredentials: true, headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
        } }).then((response) => {
            if (response.status === 201) {
                toast.success('Appointment was created successfully')
                setAppointmentSuccess('success')
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setAppointmentSuccess('failed')
                toast.error(error.response.data.error)
            }
            if (error.response.status === 401) {
                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then( (response) => {
                    if (response.status === 200) {
                        const a_token = response.data.new_a_token
                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                        postAppointment()
                    }
                }
                ).catch((error) => {
                    navigate(`/auth/login?rdrct=/book-doc/${doc_id}`)
                }
                )
            }
        })
        handleClosePopup()
    }

    const timeslotData = []
    function mapTImeslots() {
        for (const key in timeslots) {
            const slot = timeslots[key]
            if (dateValue) {
                const dateSelected = moment(dateValue).format('YYYY-M-D')
                const today = new Date()
                const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
                if (dateSelected === dateString) {
                    const currentTimeMoment = moment()
                    const timeslotTime = moment(slot.start_time.slice(0,-3), "HH:mm")
                    if (timeslotTime.isBefore(currentTimeMoment)) {
                        continue
                    }
                }
            }
            timeslotData.push(slot)
        }

        return (
            timeslotData.map((item, index) => (
                <div key={item.id} className="time-picker" onClick={() => submitAppointment(item, index)}>
                    <p>{item.start_time.slice(0, -3)} - {item.end_time.slice(0, -3)}</p>
                </div> 
                    )
                )
        )
    }

    const handleClosePopup = () => {
        setIsopen(false)
    }

    return(
        <>
        <Toaster  richColors position="top-center" expand={false}/>
        <div className='book-doc-container'>
        <div className='tob-bar'>
            <p className='blue-heading'><b>VERI DOCTOR</b></p>
        </div>
        {
            docInfo ?
             <>
                    <div className='book-doc'>
                    <div>
                        <h2>Dr. {docInfo.first_name} {docInfo.last_name}</h2>
                        <div className='approval-status'>
                            <p>operating licence</p>
                            {/* Add tooltip on hover to show verified status*/}
                            <img src={approvedIcon} width={30}></img>
                        </div>
                        { 
                            docProfile &&
                            docProfile.profile_image ? 
                                <img src={docProfile.profile_image} className='doc-image'></img> 
                                : <img src={userAvatar} className='doc-image'></img>}
                    </div>
                    <div className='book-doc-descr'>
                        <p></p>
                        <h2>Specialty</h2>
                        <p><b>{docInfo.specialty}</b> {docInfo.healthcare_facility && <>: {docInfo.healthcare_facility.name}</>}</p>
                        <p>{docInfo.sub_specialty}</p>
                        <h2>About</h2>
                        <p>{docProfile &&
                            docProfile.about }</p>
                        <div className='cons-fee-div'>
                            <h2>Fee(kshs)</h2>
                            <div>
                                <img src={moneyIcon} width={30}></img>
                                <p>
                                    {
                                        docProfile &&
                                            docProfile.consultation_fee ? docProfile.consultation_fee : '--'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='picker'>
                    <div>
                        <h2>Select a date</h2>
                        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='en-gb'>
                            <DatePicker
                                label='Pick a date'
                                onChange={handleDateChange}
                                value={dateValue}
                                disablePast
                                />
                        </LocalizationProvider>
                    </div>  
                    <h2>Select a time</h2>
                    <div className='available-times'>
                        {
                            timeslots && timeslots.length >= 1 ?
                            mapTImeslots()
                                :
                                <>
                                    <p>No timeslots available</p>
                                </>
                        }

                    </div>
                </div>
                {
                    userDetails ? 
                        isOpen &&
                        <div className='confirm-popup-overlay'>
                            <div className='confirm-popup'>
                                <p><b>Hello {userDetails && userDetails.first_name}</b></p>
                                <p>Confirm booking of Dr. {docInfo.first_name} {docInfo.last_name} on {appointmentPayload.date} between {timeslotData[selectedTimeslot].start_time.slice(0, -3)} and {timeslotData[selectedTimeslot].end_time.slice(0, -3)}</p>
                                <div className='button-group'>
                                    <button onClick={handleClosePopup} className='button'>Cancel</button>
                                    <button className='button' onClick={postAppointment}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    :
                    // have a  login popup instead of redirecting the user to a different page
                    <div className='confirm-popup-overlay'>
                        <div className='confirm-popup'>
                            <h3>Login or create account to proceed</h3>
                            <div className='button-group'>
                                <button className='button'><Link to={`/auth/login?rdrct=/book-doc/${doc_id}`}>Login</Link></button>
                                <button className='button'><Link to={`/auth/signup?rdrct=/bookk-doc/${doc_id}`}>Create account</Link></button>
                            </div>
                        </div>
                    </div>
                }
                {
                    appointmentSuccess &&
                        appointmentSuccess === 'success' ?
                            <div className='confirm-popup-overlay'>
                                <div className='confirm-popup'>
                                    <p className='booking-success'>successfully booked an appointment with Dr.{docInfo.first_name} {docInfo.last_name}</p>
                                    <button onClick={() => {userData === "doctor" ? navigate('/doc/dashboard') : navigate('/usr/dashboard')}}>Go back</button>
                                </div>
                            </div>
                        :
                        appointmentSuccess === 'failed' &&
                            <div className='confirm-popup-overlay'>
                                <div className='confirm-popup'>
                                    <p className='booking-fail'>An error occurred while processing your request</p>
                                    <button onClick={() => {navigate('/')}}>Go back</button>
                                </div>
                            </div>
                }
             </> 
             : <>Loading .....</>
            
        }
        </div>
        </>
    )
}

