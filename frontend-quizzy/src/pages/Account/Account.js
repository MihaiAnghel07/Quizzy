import React, { useEffect, useState } from 'react'
import './Account.css'
import Popup from '../../components/Popup/Popup';
import { useEditAccount } from '../../hooks/useEditAccount';
import Modal from '../../components/modal/Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';


export default function Account() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [email, setEmail] = useState(localStorage.getItem("user"));
  const [password, setPassword] = useState(localStorage.getItem("password"));
  const [showPopup, setShowPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [confirmModal2, setConfirmModal2] = useState(false);
  const [aux, setAux] = useState(false);
  const [message, setMessage] = useState("No field has been modified")
  const {editAccount, isPending, error} = useEditAccount();
  const {deleteAccount, isPending2, error2} = useDeleteAccount();
  let navigate = useNavigate();
  let location = useLocation();
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username == localStorage.getItem("username") && email == localStorage.getItem("user")) {
      setShowPopup(true);
    } else { 
      setOpenModal(true);
    }

  }

  const handlePopupClose = () => {
    setShowPopup(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault();
    navigate('/change_password');
  }

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setOpenModal2(true);
  }

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [localStorage.getItem("username")]);

  useEffect(()=>{
    if (confirmModal) {
      setOpenModal(false);
      setConfirmModal(false);
      editAccount(username, email, password);
    }

  }, [confirmModal])

  useEffect(()=>{
    if (confirmModal2) {
      setOpenModal2(false);
      setConfirmModal2(false);
      deleteAccount();
    }

  }, [confirmModal2])

  // used for adding a small delay between "Edit Account" command and popup show
  useEffect(()=>{
    if (!isPending && aux) {
      setMessage("Your account has been updated");
      setShowPopup(true);
    
    } else if (isPending) {
      setAux(true);
    }

  }, [isPending])


  useEffect(()=>{
    if (localStorage.getItem("tmpItem")) {
      setMessage(localStorage.getItem("tmpItem"));
      setShowPopup(true);
      localStorage.removeItem("tmpItem");
    }

  }, [localStorage.getItem("tmpItem")])



  return (
    <div>
      <div className='edit-account-navigation-component'>
          <NavigationComponent
              pageTitle="Edit Account"
              pairs={[]}
          />
      </div>

      <div className='account-wrapper'>
        {showPopup && 
          (
            <Popup
              message={message}
              duration={2000}
              position="top-right"
              onClose={handlePopupClose}
            />
          )}

        {openModal && 
          <div id='modal-edit-account'> 
            <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you sure you want edit your account?" /> 
          </div>
        }

        {openModal2 && 
          <div id='modal-edit-account'> 
            <Modal closeModal={setOpenModal2} yesModal={setConfirmModal2} message="Are you sure you want to delete your account? All quizzes and history will be deleted" /> 
          </div>
        }
        
        <form id="account-form" onSubmit={handleSubmit}>
          <p>Username:
            <input 
              type="username" 
              id="username-account" 
              name="username-account" 
              onChange={(e) => setUsername(e.target.value)} 
              value={username}
              required />
              <i className="validation"></i>
          </p>
          <p>Email
            <input 
              type="email" 
              id="email-account" 
              name="email-account" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              required />
              <i className="validation"></i>
          </p>
            

          {!isPending && <input 
            type="submit" 
            id="edit-account-submit" 
            value="Edit" />}

          {isPending && <input 
            type="submit" 
            id="edit-account-submit" 
            value="loading" />}

          {error &&<p className='account-showError'>{error}</p>}
        </form>

        <p>
          <button 
            type="button" 
            id="change-password-btn"
            onClick={handleChangePassword}>Change password
          </button>
        </p>

        <p>
          <button 
            type="button" 
            id="delete-account-btn"
            onClick={handleDeleteAccount}>Delete Account
          </button>
        </p>
        
      </div>
    </div>
  )
}
