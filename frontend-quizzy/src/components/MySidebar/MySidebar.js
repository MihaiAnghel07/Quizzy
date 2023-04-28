import React from 'react'
import './MySidebar.css'
import logo from '../../assets/logo.jpg'
import { FaHome, FaQuestion } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { GrContactInfo } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard/Dashboard';
import { useAuthContext } from '../../hooks/useAuthContext';
import Account from '../../pages/Account/Account';
import { AiOutlineMail } from 'react-icons/ai';


export default function MySidebar() {

  const { user } = useAuthContext()

  return (
    <div className='mySidebar-wrapper'>
      {/* <div className='mySidebar-header'>
        <h1>Header</h1>
      </div> */}
      <div>
          <img className="mySidebar-logo" src={logo}/>
      </div>
      
      <ul className='sidebar-itemList'>
        <li><FaHome/> <Link to="/dashboard" id="dashboardId" >Dashboard</Link></li>
        <li><VscAccount/> <Link to="/account" id="accountId">Account</Link></li>
        <li><FaQuestion/> FAQ</li>
        <li><AiOutlineMail/> <Link to="/contact" id="contactId">Contact</Link></li>
      </ul>
    
    </div>
  )
}
