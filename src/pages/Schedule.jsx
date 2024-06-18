import { useEffect, useState } from "react";
import { api } from "../lib/requestHandler";
import { useUser } from "../context/UserContext";
import './Schedule.css'
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import editIcon from '../assets/edit.svg'
import deleteIcon from '../assets/delete.svg'


export function Schedule(props){
    const [timeslots, setTimeslots] = useState(null)
    const [popupState, setPopupState] = useState(false)
    const [formData, setFormData] = useState({
        start_time: '',
        end_time: ''
    })
    const [timeslotPopup, setTimeslotPopup] = useState(false)
    const [activeModTimeslot, setActiveModTimeslot] = useState({})
    const [timeslotEdit, setTimeslotEdit] = useState({})
    const [scheduleopup, setSchedulePopup] = useState(false)
    const [timeslotChange, setTImeslotChange] = useState(false)
    const { userId } = useUser()

    const navigate = useNavigate()


    useEffect(() => {
        api.get(`doctor/${userId}/timeslots`).then(
            (response) => {
                if (response.status === 200) {
                    setTimeslots(response.data)
                }
            }
        )
    },[timeslotChange])


    const timeslotData = []
    function mapTImeslots() {
        for (const key in timeslots) {
            const slot = timeslots[key]
            timeslotData.push(slot)
        }
        if (timeslotData.length < 1) {
            return(
                <div>
                    You have no timeslots available
                </div>
            )
        }
        return (
            timeslotData.map((item) => (
                <div className="time-picker" key={item.id}>
                    <p>{item.start_time.slice(0,5)} - {item.end_time.slice(0, 5)}</p>
                    <div>
                        <img className="del-icon" src={editIcon} width={30} 
                            onClick={() =>{
                                setActiveModTimeslot({
                                    id: item.id,
                                    start_time: item.start_time,
                                    end_time: item.end_time
                                })
                                setTimeslotPopup(true)} }></img>
                        <img className="mod-icon" src={deleteIcon} width={30}
                            onClick={() => {
                              deleteTImeslot(item.id)
                            }}></img>
                    </div>
                </div> 
                    )
                )
        )
    }


    const handleChange = (event) => {
        const {name,  value} = event.target
        setFormData({
            ...formData, [name]: value
        })
    }


    const handleClick = () => {
        const payload = {
            "start_time": formData.start_time,
            "end_time": formData.end_time
        }

        const postTimeslots = () => {
            api.post(`timeslot`, payload,
                        {
                            headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
                            'Content-Type': 'multipart/form-data'
                        } }).then((response) => {
                            if (response.status === 201) {
                                toast.success('timeslot created')
                                setPopupState(false)
                                navigate('/doc/schedule')
                            }
                        }). catch ((error) => {
                            if (error.response.status === 400) {
                                toast.error('please provide correct times in the form 00:00')
                                setPopupState(false)
                                return
                            }
                            if (error.response.status === 401) {
                                api.post('refresh-token', {}, {withCredentials: true,  headers: {
                                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                                } }).then( (response) => {
                                    if (response.status === 200) {
                                        const a_token = response.data.new_a_token
                                        localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                                        postTimeslots()
                                    }
                                }
                                ).catch((error) => {
                                    navigate('/auth/login')
                                }
                                )
                            }
                            else {
                                toast.error('An error occurred')
                                setPopupState(false)
                            }
                        })
        }
        postTimeslots()
    }

    const handleTimeslotChange = (event) => {
        const {name, value} = event.target
        setTimeslotEdit({
            ...timeslotEdit, [name]: value
        })
    }

    const deleteTImeslot =(itemId) => {

        const deleteItem = () => {
            api.delete(`timeslot/${itemId}`, { headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
            }}).then((response) => {
                if (response.status === 204) {
                    toast.success('timeslot deleted')
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
                            deleteTImeslot(itemId)
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
                else if (error.response.status === 404) {
                    toast.error('An error occurred')
                }
                else if (error.response.status === 500) {
                    toast.error('You cannot delete this timeslot because it is being referenced by an appointment')
                }
            })
        }

        deleteItem()

    }

    const handleTimeslotEdit = () => {

        const modifyTimeslotObj = () => {
            const payload = timeslotEdit
            api.put(`timeslot/${activeModTimeslot.id}`, payload,
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    }
                }
            ).then((response) => {
                if (response.status === 200) {
                    toast.success('timeslot updated successfully')
                    setTImeslotChange(prev => !prev)
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    api.post('refresh-token', {}, {withCredentials: true,  headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`
                    } }).then( (response) => {
                        if (response.status === 200) {
                            const a_token = response.data.new_a_token
                            localStorage.setItem('acs_tkn', JSON.stringify(a_token))
                            modifyTimeslotObj()
                        }
                    }
                    ).catch((error) => {
                        navigate('/auth/login')
                    }
                    )
                }
            }
            )
        }
        modifyTimeslotObj()
        setTimeslotPopup(false)
    }

    const handleSchedulechange = () => {
        toast.success('Timeslot updated successfully')
        setSchedulePopup(false)
    }

    return (
        <>
            <div className="schedule-cont">
                <h2>Your time slots</h2>
                <div className="timeslot-cont">
                    {
                            timeslots ? 
                            mapTImeslots()
                                :
                                <p>Loading....</p>
                    }
                </div>
                <button onClick={() => {setPopupState(true)}}>Add a new timeslot</button>
                {
                    popupState && 
                        <div className="timeslot-popup-wrapper">
                            <div className="timeslot-popup">
                                <p><b>Add a new timeslot</b></p>
                                <form className="timeslot-popup-form">
                                    <label>Start time</label>
                                    <input id="start_time" name="start_time" placeholder="12:00" onChange={handleChange}></input>
                                    <label>End time</label>
                                    <input id="end_time"  name="end_time" placeholder="12:00" onChange={handleChange}></input>
                                </form>

                                <button onClick={() => {setPopupState(false)}}>cancel</button>
                                <button onClick={handleClick}>Submit</button>
                            </div>
                        </div>
                }
            </div>
            <div className="calendar-cont">
                <h2>Calendar</h2>
                {/* add  badges to calendar days to show days that are fully booked and those that are not yet booked */}
                <div className="cal-sch">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateCalendar disablePast/>
                    </LocalizationProvider>
                </div>
            </div>
            {
                timeslotPopup && 
                <div className="timeslot-popup-wrapper">
                    <div className="timeslot-popup">
                        <h2>Edit timeslot information</h2>
                        <hr></hr>
                    <form className="timeslot-popup-form" onSubmit={handleTimeslotEdit}>
                            <label>Start time</label>
                            <input name="start_time" defaultValue={activeModTimeslot.start_time.slice(0, 5)} onChange={handleTimeslotChange}></input>
                            <label>End time</label>
                            <input name="end_time" defaultValue={activeModTimeslot.end_time.slice(0, 5)} onChange={handleTimeslotChange}></input>
                    </form>
                    <button onClick={() => {setTimeslotPopup(false)}}>cancel</button>
                    <button onClick={handleTimeslotEdit}>save</button>
                    </div>
                </div>
            }
        </>
    )
}
