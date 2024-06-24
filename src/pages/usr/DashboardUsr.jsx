import { useEffect, useState } from "react"
import { useUser } from "../../context/UserContext"
import { api } from "../../lib/requestHandler"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import './DashboardUsr.css'
import { AppointmentCardUsr } from "../../components/AppointmentCardUsr"


export function DashboardUsr() {
    const navigate = useNavigate()
    const { userId } = useUser()
    const [userData, setUserData] = useState(null)
    const [healthVitals, setHealthVitals] = useState(null)
    const [recentAppointments, setRecentAppointments] = useState(null)

    useEffect(() => {
        const fetchRecentAppointments = () => {
            api.get(`patients/${userId}/appointments?filter=recent`, { withCredentials: true, headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
            } }).then((response) => {
                setRecentAppointments(response.data)
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post(`refresh-token`, {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then((response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            fetchRecentAppointments()
                        }
                    }).catch((error) => {
                        navigate('/auth/login')
                    })
                }
            })
        }
        fetchRecentAppointments()
    }, [])

    useEffect(() => {
        api.get(`users/${userId}`).then(
            (response) => {
                if (response.status === 200) {
                    setUserData(response.data)
                }
            }
        ).catch((error) => {
            toast.error('An error occurred')
            navigate('/auth/login')
        }
        )
    }, [])

    useEffect(() => {
        const gethealthVitals = () => {
            api.get(`patients/${userId}/vitals`, { withCredentials: true, headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
            } }).then((response) => {
                if (response.status === 200) {
                    setHealthVitals(response.data)
                }
            }).catch((error) => {
                if (error.response.status === 404) {
                    setHealthVitals({})
                }
                else if (error.response.status === 401) {
                    api.post(`refresh-token`, {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then((response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            gethealthVitals()
                        }
                    }).catch((error) => {
                        toast.error(error.response.status)
                        navigate('/auth/login')
                    })
                }
            })
        }

        gethealthVitals()
    },[])

    const currentTime = new Date().getHours()
    let greeting = () => {
        if (currentTime < 12) {
            return ('Good morning');
        } else if (currentTime < 18) {
            return ('Good afternoon');
        } else {
            return ('Good evening');
        }
    }

    return (
        <>
            <div className="dash-cont-usr">
                {
                    userData ?
                        <>
                            <h2>{greeting()} {userData.first_name}</h2>
                            <h2>Your health vitals</h2>
                            {
                                healthVitals &&
                                <>
                                <p>last recorded: {healthVitals.recorded ? healthVitals.recorded : '--'}</p>
                                <div className="vitals-div-wrapper">
                                    <div className="vitals-div-el">
                                        <h2>Blood pressure</h2>
                                        <p>(sys/dys)</p>
                                        <p><span className="vital-large">
                                            {healthVitals.blood_pressure_systolic ? healthVitals.blood_pressure_systolic.slice(0, -4) : '--'}/
                                            {healthVitals.blood_pressure_dystolic ? healthVitals.blood_pressure_dystolic.slice(0,-4) : '--'}
                                        </span></p>
                                        <b>mm/Hg</b>
                                    </div>
                                    <div className="vitals-div-el">
                                        <h2>Blood glucose</h2>
                                        <p><span className="vital-large">
                                            {healthVitals.blood_glucose ? healthVitals.blood_glucose.slice(0,-4) : '--'}
                                            </span></p>
                                            <b>mg/dL</b>
                                    </div>
                                    <div className="vitals-div-el">
                                        <h2>oxygen saturation</h2>
                                        <p><span className="vital-large">
                                            {healthVitals.oxygen_saturation ? healthVitals.oxygen_saturation.slice(0,-4) : '--'}
                                        </span></p>
                                        <b>%</b>
                                    </div>
                                    <div className="vitals-div-el">
                                        <h2>Blood group</h2>
                                        <p><span className="vital-large">
                                            {healthVitals.blood_group ? healthVitals.blood_group : '--'}
                                        </span></p>
                                    </div>
                                </div>
                                </>
                            }                        
                            <h2>Upcoming appointments</h2>
                            {
                                recentAppointments ?
                                    <div className="appoint-cont">
                                        {
                                            recentAppointments.map((item) => (
                                                <AppointmentCardUsr key={item.id} timeslot={item.time_slot} startTime={item.start_time} endTime={item.end_time} status={item.status} date={item.date} healthcareProviderData={item.healthcare_provider} appointment_id={item.id} is_virtual={item.is_virtual}/>
                                            ))
                                        }
                                        <Link to={`/usr/appointments`}>View all</Link>
                                    </div>
                                    :
                                    <div className="appont-cont">
                                        <p>No appointments for the next 7 days</p>
                                    </div>

                            }

                        </>
                        :
                        <p>Loading...</p>
                }
            </div>
        </>
    )
}

