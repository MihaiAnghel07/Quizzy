import React from 'react'
import './MySidebar.css'
import logo from '../../assets/logo.jpg'
import { FaHome, FaQuestion } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { GrContactInfo, GrContact } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard/Dashboard';
import { useAuthContext } from '../../hooks/useAuthContext';
import Account from '../../pages/Account/Account';
import { AiOutlineMail } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci'
import { BsTelephoneFill } from 'react-icons/bs'
import { useLogout } from '../../hooks/useLogout';



export default function MySidebar() {

  const { user } = useAuthContext()
  const navigate = useNavigate();
  const { logout } = useLogout()

  function handleDashboardButtonClick() {
    navigate('/dashboard');
  }

  function handleAccountButtonClick() {
    navigate('/account');
  }

  function handleFaqButtonClick() {
    navigate('/faq');
  }

  function handleContactButtonClick() {
    navigate('/contact');
  }


  return (
    <div className='mySidebar-wrapper'>
      <div>
          <img className="mySidebar-logo" src={logo}/>
      </div>
      <div className='sidebar-items-container'>
        <div className='sidebar-main-buttons'>
          <button id='sidebar-dashboard-button' onClick={handleDashboardButtonClick}><FaHome/>Dashboard</button>
          <button id='sidebar-account-button' onClick={handleAccountButtonClick}><VscAccount/>Account</button>
          <button id='sidebar-faq-button' onClick={handleFaqButtonClick}><FaQuestion/>FAQ</button>
          <button id='sidebar-contact-button' onClick={handleContactButtonClick}><BsTelephoneFill/>Contact</button>
        </div>
        <button id='sidebar-logout-button' onClick={logout}><CiLogout/>Log out</button>
      </div>
    </div>
  )
}
