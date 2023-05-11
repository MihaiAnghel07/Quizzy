import React, { useState } from 'react';
import './MySidebar.css';
import logo from '../../assets/logo.jpg';
import { FaHome, FaQuestion } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { GrContactInfo, GrContact } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard/Dashboard';
import { useAuthContext } from '../../hooks/useAuthContext';
import Account from '../../pages/Account/Account';
import { AiOutlineMail } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';
import { BsTelephoneFill } from 'react-icons/bs';
import { useLogout } from '../../hooks/useLogout';
import Modal from '../modal/Modal';
import { useEffect } from 'react';

export default function MySidebar(props) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();


  const [selectedButton, setSelectedButton] = useState('dashboard');

  function handleDashboardButtonClick() {
    setSelectedButton('dashboard');
    navigate('/dashboard');
  }

  function handleAccountButtonClick() {
    setSelectedButton('account');
    navigate('/account');
  }

  function handleFaqButtonClick() {
    setSelectedButton('faq');
    navigate('/faq');
  }

  function handleContactButtonClick() {
    setSelectedButton('contact');
    navigate('/contact');
  }


  return (
    <div className="mySidebar-wrapper">
      <div>
        <img className="mySidebar-logo" src={logo} />
      </div>
      <div className="sidebar-items-container">
        <div className='sidebar-username'> Logged in as {localStorage.getItem("username")}</div>
        <div className="sidebar-main-buttons">
          <button
            id={selectedButton === 'dashboard' ? 'sidebar-dashboard-button-selected' : 'sidebar-dashboard-button'}
            onClick={handleDashboardButtonClick}
          >
            <FaHome />
            Dashboard
          </button>
          <button
            id={selectedButton === 'account' ? 'sidebar-account-button-selected' : 'sidebar-account-button'}
            onClick={handleAccountButtonClick}
          >
            <VscAccount />
            Account
          </button>
          <button
            id={selectedButton === 'faq' ? 'sidebar-faq-button-selected' : 'sidebar-faq-button'}
            onClick={handleFaqButtonClick}
          >
            <FaQuestion />
            FAQ
          </button>
          <button
            id={selectedButton === 'contact' ? 'sidebar-contact-button-selected' : 'sidebar-contact-button'}
            onClick={handleContactButtonClick}
          >
            <BsTelephoneFill />
            Contact
          </button>
        </div>
        <button id="sidebar-logout-button" onClick={props.setOpenModal}>
          <CiLogout />
          Log out
        </button>
      </div>
    </div>
  );
}
