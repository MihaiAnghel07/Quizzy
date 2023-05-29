import React, { useEffect } from 'react'
import './ChangePassword.css'
import { useEditPassword } from '../../hooks/useEditPassword';
import { useState } from 'react';
import Modal from '../../components/modal/Modal';
import Popup from '../../components/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';


function ChangePassword() {

  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPassword2, setNewPassword2] = useState(null);
  const [error2, setError2] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [aux, setAux] = useState(false);
  const {changePassword, isPending, error} = useEditPassword();
  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPassword !== localStorage.getItem("password")) {
        setError2("The old password is not correct");
    } else if (newPassword === oldPassword) {
        setError2("The new password cannot be the same as the old one");
    } else if (newPassword !== newPassword2) {
        setError2("The Confirm New Password confirmation does not match");
    } else {
        setOpenModal(true);
        setError2(null);
    }

  }

    useEffect(()=>{
        if (confirmModal) {
            setOpenModal(false);
            setConfirmModal(false);
            changePassword(newPassword);
        }

    }, [confirmModal])

    // used for adding a small delay between "change password" command and popup show
    useEffect(()=>{
        if (!isPending && aux) {
            localStorage.setItem("tmpItem", "The password has been changed");
            navigate(-1, {replace:true});
        
        } else if (isPending) {
            setAux(true);
        }

    }, [isPending])

  return (
    <div>
        <div className='nav-component'> 
            <NavigationComponent
                pageTitle="Change Password"
                pairs={[['Account', '/account'],
                ['Change Password', '/change_password'],
                ]}
            />
        </div>
        {/* <h2 id="change-password-page-title">Change Password</h2> */}
        <div className='change-password-wrapper'>

            {openModal && 
            <div id='modal-change-password'> 
                <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you sure you want to change the password?" /> 
            </div>
            } 

            <div className='change-password-content'>
  
                <form id="change-password-form" onSubmit={handleSubmit}>
                
                <p>Old Password
                    <input 
                    type="password" 
                    id="password-account" 
                    name="password-account" 
                    onChange={(e) => setOldPassword(e.target.value)}
                    required />
                    <i className="validation"></i>
                </p>

                <p>New Password
                    <input 
                    type="password" 
                    id="newPassword-account" 
                    name="newPassword-account" 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required />
                    <i className="validation"></i>
                </p>

                <p>Confirm New Password
                    <input 
                    type="password" 
                    id="newPassword2-account" 
                    name="newPassword2-account" 
                    onChange={(e) => setNewPassword2(e.target.value)}
                    required />
                    <i className="validation"></i>
                </p>
                
                {!isPending && <input 
                type="submit" 
                id="change-password-submit" 
                value="Change password" />}
            
                {isPending && <input 
                type="submit" 
                id="change-password-submit" 
                value="loading" />}
                
                {error && <p className='change-password-showError'>{error}</p>}
                {error2 && <p className='change-password-showError2'>{error2}</p>}
                </form>
            </div>
        </div>
    </div>
  )
}

export default ChangePassword