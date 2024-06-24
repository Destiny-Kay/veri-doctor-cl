import './AppointmentCard.css'
import userAvatarIcon from '../assets/user-avatar.svg'
import moment from 'moment'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import closeIcon from '../assets/close.svg'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/requestHandler'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'


export function AppointmentCardUsr(props){
    const [docInfoPopup, setDocInfoPopup] = useState(false)
    const [statusChanged, setStatusChanged] = useState(null)
    const [cancelConfirmPopup, setCancelConfirmPopup] = useState(false)
    const [reschedulePopup, setReschedulePopup] = useState(false)
    const [dateValue, setDateValue] = useState(null)
    const [timeslots, setTimeslots] = useState(null)
    const [activeIndex, setActiveIndex] = useState(null)
    const [activeTImeslot, setActiveTimeslot] = useState(null)
    const [rescheduleConfirmPopup, setRescheduleConfirmPopup] = useState(false)
    const [appointmentPayload, setAppointmentPayload] = useState({
        'date': dateValue,
        'time_slot': null,
    })
    const navigate = useNavigate()


    useEffect(() => {
        api.get(`doctor/${props.healthcareProviderData.id}/timeslots?${dateValue ? "date=" + moment(dateValue).format("YYYY-MM-DD") : ''}`).then(
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
                <div key={item.id} className={`time-picker ${activeIndex === index ? 'active-timeslot' : ''}`} onClick={() =>{
                    if (dateValue === null) {
                        return toast.error('please select an appointment date first')
                    }
                    setActiveIndex(index)
                    setAppointmentPayload({...appointmentPayload, 'time_slot': item.id})
                    setActiveTimeslot(item)
                }
                }>
                    <p>{item.start_time.slice(0, -3)} - {item.end_time.slice(0, -3)}</p>
                </div> 
                    )
                )
        )
    }

    const handleAppointmentRescheduling = () => {
        api.post(`book/${props.appointment_id}/reschedule`, appointmentPayload, { withCredentials: true, headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
        } }).then((response) => {
            toast.success('Appointment reschedulesd successfully')
            setStatusChanged(response.data)
            setRescheduleConfirmPopup(false)
            setReschedulePopup(false)
        }).catch((error) => {
            if (error.response.status === 401) {
                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then( (response) => {
                    if (response.status === 200) {
                        const a_token = response.data.new_a_token
                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                        handleAppointmentRescheduling()
                    }
                }
                ).catch((error) => {
                    navigate(`/auth/login?rdrct=/book-doc/${doc_id}`)
                }
                )
            }
            else {
                toast.error('An error occurred')
                setRescheduleConfirmPopup(false)
                setReschedulePopup(false)
            }
        })
    }

    const handleAppointmentCancelation =() => {
        const cancelAppointment = () => {
            api.post(`book/${props.appointment_id}/cancel`, {}, {
                headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
            } }).then((response) => {
                toast.success(`Your appointment with ${props.healthcareProviderData.first_name + ' ' + props.healthcareProviderData.last_name} has been cancelled`)
                setStatusChanged(response.data)
                
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            cancelAppointment()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
            })
        }
        cancelAppointment()
        setCancelConfirmPopup(false)
    }


    const openDoctorInformation = () => {
        setDocInfoPopup(true)
    }

    return (
        <>
            <div className='appointment-card'>
                <div className='image-cont'>
                    <img src={userAvatarIcon} width={50}></img>
                    <div>
                        {
                            props.is_virtual === true ?
                            <p className='online-tag'>Online</p>
                            :
                            <p className='online-tag'>In person</p>
                        }
                        {
                            props.healthcareProviderData &&
                            <>
                                <p className='doc-information' onClick={openDoctorInformation}>{props.healthcareProviderData.title}. {props.healthcareProviderData.first_name} {props.healthcareProviderData.last_name}</p>
                            </>
                        }
                        {
                            statusChanged ? 
                            <b><p className={statusChanged.status}>{statusChanged.status}</p></b>
                            :
                            <b><p className={props.status}>{props.status}</p></b>
                        }
                    </div>
                </div>
                <div>
                    {
                        statusChanged ?
                        <>
                            <p>{moment(statusChanged.date).format('DD MMMM YYYY')}</p>
                            {
                                statusChanged.status === 'RESCHEDULED' ?
                                    <p>{statusChanged.timeslot}</p>
                                :
                                    <p>{props.startTime.slice(0, -3)} - {props.endTime.slice(0, -3)}</p>
                            }
                            {
                            statusChanged.status === 'PLACED' ?
                            <div>
                                <button className='button' onClick={() => setCancelConfirmPopup(true)}>cancel</button>
                                <button className='button' onClick={() => setReschedulePopup(true)}>reschedule</button>
                            </div>
                            :
                            statusChanged.status === 'RESCHEDULED' &&
                            <button className='button' onClick={handleAppointmentCancelation}>cancel</button>
                            }
                        </>
                        :
                        <>
                            <p>{moment(props.date).format('DD MMMM YYYY')}</p>
                            <p>{props.startTime.slice(0, -3)} - {props.endTime.slice(0, -3)}</p>
                            {
                            props.status === 'PLACED' ?
                            <div>
                                <button className='button' onClick={() => setCancelConfirmPopup(true)}>cancel</button>
                                <button className='button' onClick={() => setReschedulePopup(true)}>reschedule</button>
                            </div>
                            :
                            props.status === 'RESCHEDULED' &&
                            <button className='button' onClick={() => setCancelConfirmPopup(true)}>cancel</button>
                            }
                        </>
                    }
                </div>
            </div>
            {
                docInfoPopup &&
                <div className='appointment-popup'>
                    <div className='appointment-popup-div h-80'>
                        <img  src={closeIcon} alt='close icon' className='close-popup-icon' width={40} onClick={() => setDocInfoPopup(false)}></img>
                        <h3>{props.healthcareProviderData.title} {props.healthcareProviderData.first_name} {props.healthcareProviderData.last_name}</h3>
                        <p className='book-link'>Booking link: <Link to={`https://veridoctor.com/book-doc/${props.healthcareProviderData.id}`}>{`https://veridoctor.com/book-doc/${props.healthcareProviderData.id}`}</Link></p>
                        <div className="doc-details">
                            <p><span>Specialty: </span>{props.healthcareProviderData.specialty}</p>
                            <p><span>Sub specialty: </span>{props.healthcareProviderData.sub_specialty}</p>
                            <p><span>Healthcare Facility: </span>{props.healthcareProviderData.facility ? props.healthcareProviderData.facility : '--'}</p>
                        </div>
                    </div>
                </div>
            }
            {
                cancelConfirmPopup &&
                <div className='appointment-popup'>
                    <div className='appointment-popup-div'>
                        <h4>Confirm cancelation of an appointment with {props.healthcareProviderData.first_name} {props.healthcareProviderData.last_name}</h4>
                        <h4>on {moment(props.date).format('DD MMMM YYYY')} at {props.startTime.slice(0, -3)}</h4>
                        <div>
                            <button onClick={() => setCancelConfirmPopup(false)}>Back</button>
                            <button onClick={() => {
                                handleAppointmentCancelation()
                            }}>Confirm</button>
                        </div>
                    </div>
                </div>
            }
            {
                reschedulePopup &&
                <div className='appointment-popup'>
                    <div className='appointment-popup-div'>
                        <h4>Reschedule Your appointment with <i>{`${props.healthcareProviderData.first_name} ${props.healthcareProviderData.last_name} `}</i>to a later date!</h4>
                        <hr></hr>
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
                    <h2>Available timeslots</h2>
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
                        <div className='button-group'>
                            <button onClick={() => setReschedulePopup(false)}>Cancel</button>
                            <button onClick={() => setRescheduleConfirmPopup(true)}>Confirm</button>
                        </div>
                    </div>
                </div>   
            }
            {
                rescheduleConfirmPopup &&
                <div className='appointment-popup'>
                    <div className="appointment-popup-div">
                        <p>Confirm rescheduling of appointment with {`${props.healthcareProviderData.first_name} ${props.healthcareProviderData.last_name} from ${props.startTime} on  ${moment(props.date).format("DD MMMM YYYY")} to ${moment(appointmentPayload.date).format("DD MMMM YYYY")} at ${activeTImeslot.start_time.slice(0, -3)}`}</p>
                        <div className='button-group'>
                            <button onClick={() => {
                                setRescheduleConfirmPopup(false)
                            }}>Back</button>
                            <button onClick={handleAppointmentRescheduling}>Ok</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
