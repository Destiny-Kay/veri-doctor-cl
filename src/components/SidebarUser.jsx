import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import dashboardIcon from '../assets/dashboard.svg'
import logoutIcon from '../assets/logout.svg'
import prfileIcon from '../assets/profile.svg'
import closeIcon from '../assets/close.svg'
import { api } from "../lib/requestHandler";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import appointmentIcon from '../assets/appointment.svg'
import doctorIcon from '../assets/doctor.svg'
import communityIcon from '../assets/community.svg'
import pharmacyIcon from '../assets/pharmacy-icon.svg'
import recordsIcon from '../assets/records.svg'
import { useUser } from "../context/UserContext";
import './Sidebar.css'



export function SidebarUser(props) {
    const navigate = useNavigate()
    const {setUserData} = useUser()
    const [dropdown, setDropdown] = useState(false)
    const showDropDown = () => {
        setDropdown(!dropdown)
    }
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
                setUserData(null)
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
            <div className="side-bar">
                <Link to='/'><h1>VERI DOCTOR</h1></Link>
                <hr />
                <div className="side-bar-menu">
                    <ul>
                        <li className="side-item">
                            <NavLink to={'/usr/dashboard'}
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                                <img src={dashboardIcon} width={20}></img>
                                    Dashboard</NavLink>
                        </li>
                        <li className="side-item">
                            <NavLink to={'/usr/profile'}
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                                <img src={prfileIcon} width={20}></img>
                                Profile</NavLink>
                        </li>
                        <li className="side-item">
                            <NavLink to={'/usr/appointments'}
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                                <img src={appointmentIcon} width={20}></img>
                                    Appointments</NavLink>
                        </li>
                        <li className="side-item">
                            <NavLink to={'/usr/records'}
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                                <img src={recordsIcon} width={20}></img>
                                    Records</NavLink>
                        </li>
                        <li className="side-item">
                            <NavLink to={'/usr/doctors'}
                                className={({isActive}) => {return isActive ? 'nav-active' : ''}}>
                                <img src={doctorIcon} width={20}></img>
                                    Doctors</NavLink>
                        </li>
                        <li className="side-item logout" onClick={handleLogout}>
                            <img src={logoutIcon}></img>
                            logout
                        </li>
                    </ul>
                </div>
            </div>

            {
                dropdown ? 
                    <div className="dropdown-menu" id='dropdown-menu'>
                        <img src={closeIcon} onClick={showDropDown} className='close-ham'></img>
                        <ul>
                            <li onClick={showDropDown}>
                                <NavLink to='/'
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}
                                >Home</NavLink>
                            </li>
                            <li onClick={showDropDown}>
                                <NavLink to={'/usr/dashboard'}
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}
                                >Dashboard</NavLink>
                            </li>
                            <li onClick={showDropDown}>
                                <NavLink to={'/usr/profile'}
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}
                                    >Profile</NavLink>
                            </li>
                            <li onClick={showDropDown}>
                                <NavLink to={'/usr/appointments'}
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}>Appointments</NavLink></li>
                            <li onClick={showDropDown}> 
                                <NavLink to={'/usr/records'}
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}
                                    >Records</NavLink>
                            </li>
                            <li onClick={showDropDown}>
                                <NavLink to={'/usr/doctors'}
                                className={({isActive}) => {return isActive ? 'nav-active-mobile' : ''}}>Doctors</NavLink></li>
                            <br></br>
                            <li onClick={handleLogout}>logout</li>
                        </ul>
                    </div>
                :
                <div className="ham-menu-header">
                    <div className="ham-menu" onClick={showDropDown}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            }
        </div>
    )
}