import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg'
import './Navbar.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'


export default function Navbar() {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const navigate = useNavigate()


  function handleHomeButtonClick() {
    navigate('/', {replace: true});
  }

  function handleLoginButtonClick() {
    navigate('/login');
  }

  function handleSignupButtonClick() {
    navigate('/signup');
  }

  function handleDashboardButtonClick() {
    navigate('/dashboard');
  }

  return (
    <div className='navbar-wrapper'>
        <div onClick={handleHomeButtonClick}>
            <img className="navbar-logo" src={logo}/>
        </div>

        <div className="nav-links">
          <button id='navbar-home-button' onClick={handleHomeButtonClick}>Home</button>
          <button id='navbar-login-button' onClick={handleLoginButtonClick}>Log in</button>
          <button id='navbar-signup-button' onClick={handleSignupButtonClick}>Sign up</button>
          <button id='navbar-dashboard-button' onClick={handleDashboardButtonClick}>Dashboard</button>
        </div>
    </div>
  )
}
