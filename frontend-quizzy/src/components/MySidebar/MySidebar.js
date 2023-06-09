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
import { BiHistory } from "react-icons/bi";

export default function MySidebar(props) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();


  const [selectedButton, setSelectedButton] = useState('dashboard');

  useEffect(()=>{
    console.log("RRRRRRRRRR")
    if (localStorage.getItem("selectedButton") == null)
      setSelectedButton('dashboard');
    else
      setSelectedButton(localStorage.getItem("selectedButton"));

  }, [localStorage.getItem("selectedButton")])

  function handleDashboardButtonClick() {
    if (sessionStorage.getItem("quizOnGoing")) {
      let startTime = new Date().getTime();

      if (window.confirm("Are you sure you want to leave the quiz? You will not be able to re-attempt the quiz!")) {
        localStorage.removeItem("currentQuestionCount");
        localStorage.removeItem("quizDuration");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        setSelectedButton('dashboard');
        localStorage.setItem("selectedButton", "dashboard");
        navigate('/dashboard', {replace: true});

      } else {
        const duration = Math.round((new Date().getTime() - startTime) / 1000);
        console.log(`Confirmation dialog lasted for ${duration} seconds.`);
        localStorage.setItem("alertTime", (parseInt(localStorage.getItem("alertTime") == null? 0 : localStorage.getItem("alertTime")) +  duration));
      }
    
    } else {
      setSelectedButton('dashboard');
      localStorage.setItem("selectedButton", "dashboard");
      navigate('/dashboard');
    }

    
  }

  function handleAccountButtonClick() {
    if (sessionStorage.getItem("quizOnGoing")) {
      let startTime = new Date().getTime();

      if (window.confirm("Are you sure you want to leave the quiz? You will not be able to re-attempt the quiz!")) {
        localStorage.removeItem("currentQuestionCount");
        localStorage.removeItem("quizDuration");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        setSelectedButton('account');
        localStorage.setItem("selectedButton", "account");
        navigate('/account', {replace: true});

      } else {
        const duration = Math.round((new Date().getTime() - startTime) / 1000);
        console.log(`Confirmation dialog lasted for ${duration} seconds.`);
        localStorage.setItem("alertTime", (parseInt(localStorage.getItem("alertTime") == null? 0 : localStorage.getItem("alertTime")) +  duration));
      }
    
    } else {
      setSelectedButton('account');
      localStorage.setItem("selectedButton", "account");
      navigate('/account');
    }
    
  }

  function handleFaqButtonClick() {
    if (sessionStorage.getItem("quizOnGoing")) {
      let startTime = new Date().getTime();

      if (window.confirm("Are you sure you want to leave the quiz? You will not be able to re-attempt the quiz!")) {
        localStorage.removeItem("currentQuestionCount");
        localStorage.removeItem("quizDuration");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        setSelectedButton('faq');
        localStorage.setItem("selectedButton", "faq");
        navigate('/faq', {replace: true});

      } else {
        const duration = Math.round((new Date().getTime() - startTime) / 1000);
        console.log(`Confirmation dialog lasted for ${duration} seconds.`);
        localStorage.setItem("alertTime", (parseInt(localStorage.getItem("alertTime") == null? 0 : localStorage.getItem("alertTime")) +  duration));
      }
    
    } else {
      setSelectedButton('faq');
      localStorage.setItem("selectedButton", "faq");
      navigate('/faq');
    }
    
  }

  function handleContactButtonClick() {
    if (sessionStorage.getItem("quizOnGoing")) {
      let startTime = new Date().getTime();

      if (window.confirm("Are you sure you want to leave the quiz? You will not be able to re-attempt the quiz!")) {
        localStorage.removeItem("currentQuestionCount");
        localStorage.removeItem("quizDuration");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        setSelectedButton('contact');
        localStorage.setItem("selectedButton", "contact");
        navigate('/contact', {replace: true});

      } else {
        const duration = Math.round((new Date().getTime() - startTime) / 1000);
        console.log(`Confirmation dialog lasted for ${duration} seconds.`);
        localStorage.setItem("alertTime", (parseInt(localStorage.getItem("alertTime") == null? 0 : localStorage.getItem("alertTime")) +  duration));
      }
    
    } else {
      setSelectedButton('contact');
      localStorage.setItem("selectedButton", "contact");
      navigate('/contact');
    }
    
  }

  function handleHistoryButtonClick() {
    if (sessionStorage.getItem("quizOnGoing")) {
      let startTime = new Date().getTime();

      if (window.confirm("Are you sure you want to leave the quiz? You will not be able to re-attempt the quiz!")) {
        localStorage.removeItem("currentQuestionCount");
        localStorage.removeItem("quizDuration");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        setSelectedButton('history');
        localStorage.setItem("selectedButton", "history");
        navigate('/history', {replace: true});

      } else {
        const duration = Math.round((new Date().getTime() - startTime) / 1000);
        console.log(`Confirmation dialog lasted for ${duration} seconds.`);
        localStorage.setItem("alertTime", (parseInt(localStorage.getItem("alertTime") == null? 0 : localStorage.getItem("alertTime")) +  duration));
      }
    
    } else {
      setSelectedButton('history');
      localStorage.setItem("selectedButton", "history");
      navigate('/history');
    }
    
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
            id={selectedButton === 'history' ? 'sidebar-history-button-selected' : 'sidebar-history-button'}
            onClick={handleHistoryButtonClick}
          >
            <BiHistory />
            History
          </button>
          <button
            id={selectedButton === 'account' ? 'sidebar-account-button-selected' : 'sidebar-account-button'}
            onClick={handleAccountButtonClick}
          >
            <VscAccount />
            Edit Account
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
