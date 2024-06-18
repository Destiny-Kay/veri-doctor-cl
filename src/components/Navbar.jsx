import './index.css'
import logoIcon from '../assets/logo.svg'
import { Link, NavLink } from 'react-router-dom'
import { MainButton } from './MainButton'
import { useState } from 'react'
import close from '../assets/close.svg'
import { useUser } from '../context/UserContext'


export function Navbar(props) {
    const [dropdown, setDropdown] = useState(false)
    const userData = JSON.parse(localStorage.getItem('user_data'))

    const showDropDown = () => {
        setDropdown(!dropdown)
    }

    return (
        <nav className='header'>
            <Link to={'/'} aria-label='Go to home page'>
                {/* <img src={logoIcon} className='logo' alt='logo'></img> */}
                <p className='logo-placeholder'>VERI <span>DOCTOR</span></p>
            </Link>
            <div className="main-menu">
                <ul>
                    <li><NavLink to={'/doctors'} aria-label='Go to doctors page' className={({isActive}) => {
                        return isActive ? 'active-link' : ''
                    }}>doctors</NavLink></li>
                    <li><NavLink to={'/contact'} aria-label='Go to contacts page' className={({isActive}) => {
                        return isActive ? 'active-link' : ''
                    }}>contact</NavLink></li>
                    <li><NavLink to={'/about'} aria-label='Go to about page' className={({isActive}) => {
                        return isActive ? 'active-link' : ''
                    }}>about</NavLink></li>
                </ul>

                {
                    !userData ?
                    <div className='nav-buttons'>
                        <MainButton name='sign up' size='small' variant='outlined' link='/auth/signup'/>
                        <MainButton name='login' variant='filled' size='small' link='/auth/login'/>
                    </div>
                    :
                    <div className='nav-buttons'>
                        <MainButton name='account' variant='filled' link={userData === 'doctor' ? '/doc/dashboard' : '/usr/dashboard'}></MainButton>
                    </div>
                }
            </div>
            {
                dropdown ? ( 
                        <div className='dropdown-menu' id='dropdown-menu'>
                            <img src={close} onClick={showDropDown} className='close-ham' alt='close-icon'></img>
                            <ul>
                                <li onClick={showDropDown} aria-label='Go to home page'>
                                    <NavLink to={'/'} 
                                        className={({isActive}) => {return isActive ? 'active-link' : '' }}>home</NavLink></li>
                                <li onClick={showDropDown}>
                                    <NavLink to={'/doctors'} aria-label='Go to doctors page'
                                        className={({isActive}) => {return isActive ? 'active-link' : '' }}>doctors</NavLink></li>
                                <li onClick={showDropDown}>
                                    <NavLink to={'/contact'} aria-label='Go to contacts page'
                                        className={({isActive}) => {return isActive ? 'active-link' : '' }}>contact</NavLink></li>
                                <li onClick={showDropDown}>
                                    <NavLink to={'/about'} aria-label='Go to about page'
                                        className={({isActive}) => {return isActive ? 'active-link' : '' }}>about</NavLink></li>
                            </ul>
                            {
                                    !userData ?
                                    <>
                                        <MainButton name='signup' variant='filled' size='large' link='/auth/signup' />
                                        <MainButton name='login' variant='filled' size='large'link='/auth/login' />
                                    </>
                                    :

                                    <>
                                        <MainButton name='account' variant='filled' link={userData === 'doctor' ? '/doc/dashboard' : '/usr/dashboard'}></MainButton>
                                    </>
                            }
                        </div>
                    ) :
                (
                    <div className='ham-menu' onClick={showDropDown}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
            )}
        </nav>
    )
}
