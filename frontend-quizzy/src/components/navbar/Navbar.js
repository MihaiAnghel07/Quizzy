import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg'
import './Navbar.css'



export default function Navbar() {
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


  return (
    <div className='navbar-wrapper'>
        <div onClick={handleHomeButtonClick}>
            <img className="navbar-logo" src={logo}/>
        </div>

        <div className="nav-links">
          <button id='navbar-home-button' onClick={handleHomeButtonClick}>Home</button>
          <button id='navbar-login-button' onClick={handleLoginButtonClick}>Log in</button>
          <button id='navbar-signup-button' onClick={handleSignupButtonClick}>Sign up</button>
        </div>
    </div>
  )
}
