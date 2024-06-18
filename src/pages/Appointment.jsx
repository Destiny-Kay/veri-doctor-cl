import { AppointmentCard } from "../components/AppointmentCard";
import './DocPages.css'
import { useState } from "react";
import { useEffect } from "react";
import { api } from "../lib/requestHandler";
import { useNavigate } from "react-router-dom";


export function Appointments() {
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState(null)
    const [filter, setFilter] = useState(null)
    const [subFilter, setSubFilter] = useState("placed")
    const [activeFilter, setActiveFilter] = useState("today")
    const [currentPage, setCurrentPage] = useState(1)

    
    useEffect(() => {
        const fetchAppointments = () => {
                api.get(`appointments?filter=${activeFilter}&page=${currentPage}&status=${subFilter}`, { withCredentials: true, headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                } }).then(
                    (response) => {
                        if (response.status === 200) {
                            setAppointments(response.data)
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
                                fetchAppointments()
                            }
                        }
                        ).catch(() => {
                            navigate('/auth/login')
                        }
                        )
                    }
                }
                )
        }
        fetchAppointments()
    }, [filter, currentPage, subFilter])

    return (
        // use outlet routes in here to avoid calling api endpoints evey time a doctor is switching to a different tab
        <>
            <div className="appointment-cont">
                <div className="select-cont">
                    <div className={`appointment-param ${activeFilter === "today" ? "active": ""}`} onClick={
                        () => {
                            setFilter("today")
                            setActiveFilter("today")
                            }}>Today</div>
                    <div className={`appointment-param ${activeFilter === "7days" ? "active": ""}`} onClick={
                        () => {
                            setFilter("7days")
                            setActiveFilter("7days")
                            }}>Next 7 days</div>
                    <div className={`appointment-param ${activeFilter === "month" ? "active": ""}`} onClick={
                        () => {
                            setFilter("month")
                            setActiveFilter("month")
                            }}>Next 1 month</div>
                    <div className={`appointment-param ${activeFilter === "previous" ? "active": ""}`} onClick={
                        () => {
                            setFilter("previous")
                            setActiveFilter("previous")
                            }}>Previous</div>
                </div>
                <div className="filter-status">
                    <div className={`placed ${subFilter === "placed" ? "placed-active" : ""}`}
                        onClick={() => {
                            setSubFilter("placed")
                        }}>Placed</div>
                    <div className={`attended ${subFilter === "attended" ? "attended-active" : ""}`}
                        onClick={() => {
                            setSubFilter("attended")
                        }}
                    >Attended</div>
                    <div className={`canceled ${subFilter === "canceled" ? "canceled-active" : ""}`}
                        onClick={() => {
                            setSubFilter("canceled")
                        }}>Canceled</div>
                    <div className={subFilter === "all" ? "all-active" : ""}
                        onClick={() => {
                            setSubFilter("all")
                        }}>All</div>
                </div>
                <h2>Appointments</h2>
                <div className="appointment-cards">
                {appointments ? (
                    appointments.data.length > 0 ? (
                        appointments.data.map((item) => (
                            <AppointmentCard key={item.id} appointment_id={item.id} patient={item.patient} timeslot={item.time_slot} startTime={item.start_time} endTime={item.end_time} date={item.date} status={item.status}/>
                                )
                            )
                        ) : (
                    <h2>No appointments for this period</h2>
                            )
                    ) : (
                        <option>Loading data...</option>
                        )}
                </div>
                {
                    appointments ?
                    appointments.data.length > 0 &&
                    <div className="paginator-cont">
                        <p className={currentPage > 1 ? "active" : ""}
                            onClick={() => {
                                currentPage > 1 &&
                                setCurrentPage(prev => prev - 1)
                            }}
                        ><b>&lt;&lt; Previous</b></p>
                        <p className={currentPage < appointments.pages ? "active": ""}
                            onClick={() => {
                                currentPage < appointments.pages &&
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
