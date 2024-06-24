import { AppointmentCardUsr } from "../../components/AppointmentCardUsr";
import './Appointment.css'
import { useEffect, useState } from "react";
import { api } from "../../lib/requestHandler";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";


export function AppointmentUsr(props) {
    const [appointmentData, setAppointmentData] = useState(null)
    const [activeFilter, setActiveFilter] = useState("today")
    const [filter, setFilter] = useState("today")
    const {userId} = useUser()
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAppointments = () => {
            api.get(`patients/${userId}/appointments?filter=${filter}`, { withCredentials: true, headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
            } }).then((response) => {
                if (response.status === 200) {
                    setAppointmentData(response.data)
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post(`refresh-token`, {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then((response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            fetchAppointments()
                        }
                    })
                }
            }).catch((error) => {
                navigate(`/auth/login`)
            })
        }

        fetchAppointments()
    }
    ,[filter])

    return (
        <>
            <div className="appointment-cont">
                <div className="select-cont">
                    <div className={`appointment-param ${activeFilter === "today" ? "active": ""}`} onClick={
                        () => {
                            setFilter("today")
                            setActiveFilter("today")
                            }}>Today</div>
                    <div className={`appointment-param ${activeFilter === "upcoming" ? "active": ""}`} onClick={
                        () => {
                            setFilter("upcoming")
                            setActiveFilter("upcoming")
                            }}>Upcoming</div>
                    <div className={`appointment-param ${activeFilter === "previous" ? "active": ""}`} onClick={
                        () => {
                            setFilter("previous")
                            setActiveFilter("previous")
                            }}>Previous</div>
                </div>
                {
                    appointmentData ? (
                        appointmentData.data.length > 0 ? (
                            appointmentData.data.map((item) => (
                                <AppointmentCardUsr key={item.id} timeslot={item.time_slot} startTime={item.start_time} endTime={item.end_time} status={item.status} date={item.date} healthcareProviderData={item.healthcare_provider} appointment_id={item.id} is_virtual={item.is_virtual}/>
                            ))
                        ) : (
                            <h2>You have no appointments</h2>
                        )
                    ) : (
                        <p>Loading data...</p>
                    )
                }
                 {
                    appointmentData ?
                    appointmentData.data.length > 0 &&
                    <div className="paginator-cont">
                        <p className={currentPage > 1 ? "active" : ""}
                            onClick={() => {
                                currentPage > 1 &&
                                setCurrentPage(prev => prev - 1)
                            }}
                        ><b>&lt;&lt; Previous</b></p>
                        <p className={currentPage < appointmentData.pages ? "active": ""}
                            onClick={() => {
                                currentPage < appointmentData.pages &&
                                setCurrentPage(prev => prev + 1)
                            }}
                        ><b>Next &gt;&gt;</b></p>
                    </div>
                    :
                    <>
                    </>
                }
                
            </div>
        </>
    )
}