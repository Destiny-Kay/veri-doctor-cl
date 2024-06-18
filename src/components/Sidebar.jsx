import './Sidebar.css'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import close from '../assets/close.svg'
import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { api } from '../lib/requestHandler'
import { useUser } from '../context/UserContext'
import dashboardIcon from '../assets/dashboard.svg'
import profileIcon from '../assets/profile.svg'
import appointmentIcon from '../assets/appointment.svg'
import scheduleIcon from '../assets/schedule.svg'
import logoutIcon from '../assets/logout.svg'


export function Sidebar(props){
    const { userId } = useUser()
    const [dropdown, setDropdown] = useState(false)
    const [userData,  setUserData] = useState(null)

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

    const showDropDown = () => {
        setDropdown(!dropdown)
    }


    const navigate = useNavigate()
    const handleLogout = () => {
        showDropDown()
        api.post('logout', {}, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('acs_tkn'))}`,
            }
        }).then((response) => {
            if (response.status === 204) {
                toast.success('You have been logged out successfully')
                localStorage.removeItem('user_id')
                localStorage.removeItem('acs_tkn')
                localStorage.removeItem('user_data')
                navigate('/')
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
                        handleLogout()
                    }
                }
                ).catch((error) => {
                    navigate('/auth/login')
                }
                )
            }
            else {
                navigate('/auth/login')
            }
        })
    }

    return (
        <div>
            <div className='side-bar'>
                <h1>VERI DOCTOR</h1>
                <hr/>
                <div className='side-bar-menu'>
                    <ul>
                        <li className='side-item'>
                            <NavLink to={`/doc/dashboard`}
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                            <img src={dashboardIcon} width={20}></img>
                            Dashboard
                            </NavLink>
                        </li>
                        <li className='side-item'>
                            <NavLink to='/doc/profile'
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                            <img src={profileIcon} width={20}></img>
                            Profile
                            </NavLink>
                        </li>
                        <li className='side-item'>
                            <NavLink to='/doc/appointments'
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                            <img src={appointmentIcon} width={20}></img>
                            Appointments</NavLink>
                        </li>
                        <li className='side-item'>
                            <NavLink to='/doc/schedule'
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                            <img src={scheduleIcon} width={20}></img>
                            Schedule</NavLink>
                        </li>
                        <li className='side-item logout' onClick={handleLogout}>
                            <img src={logoutIcon} width={20}></img>
                            logout
                        </li>
                    </ul>
                </div>
            </div>

            {
                dropdown ? (
                    <div className='dropdown-menu' id='dropdown-menu'>
                        <img src={close} onClick={showDropDown} className='close-ham'></img>
                        <ul>
                            <li onClick={showDropDown}>
                                <NavLink to={'/doc/dashboard'}
                                    className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}
                                    >Dashboard</NavLink></li>
                            <li onClick={showDropDown}>
                                <NavLink to={'/doc/profile'}
                                    className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}>Profile</NavLink></li>
                            <li onClick={showDropDown}>
                                <NavLink to={'/doc/appointments'} 
                                    className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}>Appointments</NavLink></li>
                            <li onClick={showDropDown}><NavLink to={'/doc/schedule'}
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}>Schedule</NavLink></li>
                                <br></br>
                            <li onClick={handleLogout}>logout</li>
                        </ul>
                    </div>
                    ) :
                (
                    <div className='ham-menu-header'>
                        <div className='ham-menu' onClick={showDropDown}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
            )}
        </div>
    )
}