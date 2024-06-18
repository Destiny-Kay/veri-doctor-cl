import { useUser } from "../context/UserContext"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../lib/requestHandler"
import { toast } from "sonner"
import './Dashboard.css'
import { DocStatCard } from "../components/DocStatCard"
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Badge } from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import {
    Chart as ChartJs,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

import moment from "moment"


import patientIcon from '../assets/patients.svg'
import statIcon from '../assets/stat.svg'


ChartJs.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip, 
    Legend
)

export function Dashboard(props) {
    const navigate = useNavigate()
    const { userId } = useUser()
    const [userData,  setUserData] = useState(null)
    const [stats, setStats] = useState(null)
    const [dateValue, setDateValue] = useState(null)
    const [dayAppointments, setDayAppointments] = useState(null)


    useEffect(() => {
        function getStats() {
            api.get(`weeklystats`, { withCredentials: true, headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
            } }).then((response) => {
                if (response.status === 200) {
                    setStats(response.data)
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            getStats()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
            })
        }

        getStats()
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

    // useEffect(() => {
    //     const getDayAppointments = () => {
    //         api.get(`appointments?day=${dateValue}`)
    //     }
    // }, [dateValue])

    const initialData = {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
            {
                label: 'appointments',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'aqua',
                borderColor: 'black',
                borderWidth: 2
            }
        ]
    }
    const [data, setData] = useState(initialData)

    useEffect(() => {
        if (stats) {
            const updatedData = {
                ...initialData,
                labels: Object.keys(stats.weekly_data),
                datasets : [
                    {
                        label: 'appointments',
                        data: Object.values(stats.weekly_data),
                        backgroundColor: 'blue',
                        borderColor: 'black',
                        borderWidth: 2
                    }
                ]
            }
            setData(updatedData)
        }
    }
    ,[stats])

    const handleDateChange = (newValue) => {
        setDateValue(newValue)
        const getDayAppointments = () => {
            api.get(`appointments?day=${moment(newValue).format('YYYY-MM-DD')}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    setDayAppointments(response.data)
                }
            }
            ).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            getDayAppointments()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
            })
        }

        getDayAppointments()
    }

    const options = {}


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
    const today = new Date()
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7))
    
    return (
        <>
            {userData ?
                <>     
                <div className="doc-banner">
                    <h2>{greeting()}, {userData.first_name}</h2>
                    <p>Have a great day at work!</p>
                </div>
                <div className="dash-cont">
                    <div>
                        <h2>Weekly reports</h2>
                        {
                            stats &&
                            // <p><i> {moment(today).format('DD MMMM YYYY')} - {moment(sevenDaysAgo).format('DD MMMM YYYY')} </i></p>
                            <></>
                        }
                        <div className="dash-stats">
                            {
                                stats && 
                                <>
                                    <DocStatCard title="Total patients" stat={stats.patients_past_seven_days} image={patientIcon}/>
                                    <DocStatCard title="Pending appointments" stat={stats.pending_appointments} image={statIcon}/>
                                </>
                            }
                        </div>
                        <div className="doc-analytics">
                            <h2>Appointments </h2>
                            {
                                stats && 
                                <Bar
                                    data={data}
                                    options={options}
                                >
                                </Bar>
                            }
                        </div>
                    </div>
                    <div className="side-div">
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateCalendar
                                onChange={handleDateChange}
                                value={dateValue} 
                            />
                        </LocalizationProvider>
                        <div>
                            {
                                dateValue &&
                                <>
                                    <b><p>{moment(dateValue).format('DD MMMM YYYY')}</p></b>
                                    {
                                        dayAppointments &&
                                        <>
                                            <p>Total appointments: {dayAppointments.total}</p>
                                            <p>Attended to: {dayAppointments.attended}</p>
                                            <p>Canceled appointments: {dayAppointments.cancelled}</p>
                                        </>
                                    }
                                </>
                            }
                        </div>
                        <Link to={'/doc/appointments'}>View all appointments</Link>
                    </div>
                    </div>
                    </>
                : <div>Loading....</div>
        }
        </>
    )
}
