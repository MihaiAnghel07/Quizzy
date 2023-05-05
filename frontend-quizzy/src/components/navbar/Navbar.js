import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg'
import './Navbar.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'


export default function Navbar() {
  const { user } = useAuthContext()
  const { logout } = useLogout()

  return (
    <nav>
        <div>
            <img className="logo" src={logo}/>
        </div>

        <div className="NavLinks">
            {!user && <Link to="/" id="home">Home</Link>}
            {!user && <Link to="/login" id="login">Login</Link>}
            {!user && <Link to="/signup" id="signup">Signup</Link>}
            {!user && <Link to="/dashboard" id="first">Dashboard</Link>}
            {user && <button className='btn' onClick={logout}>Logout</button>}
        </div>
    </nav>
  )
}
