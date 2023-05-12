import React, { useState } from 'react'
import './Account.css'
import Popup from '../../components/Popup/Popup';
import { FaCheck } from 'react-icons/fa';
import { useEditAccount } from '../../hooks/useEditAccount';


export default function Account() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [email, setEmail] = useState(localStorage.getItem("user"));
  const [password, setPassword] = useState(localStorage.getItem("password"));
  const [showPopup, setShowPopup] = useState(false);
  const {editAccount, isPending, error} = useEditAccount();
 
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (username == localStorage.getItem("username") && email == localStorage.getItem("user")) {
      setShowPopup(true)
    } else {
      editAccount(username, email, password);
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false)
  }

  return (
    <div className='account-wrapper'>
      {showPopup && 
        (
          <Popup
            message="No field has been modified"
            duration={2000}
            position="top-right"
            // icon = {<FaCheck className='flag-button'/>}
            onClose={handlePopupClose}
          />
        )}

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
        <p>Password
          <input 
            type="password" 
            id="password-account" 
            name="password-account" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required />
            <i className="validation"></i>
        </p>
        
        {/* <p> */}
          {!isPending && <input 
            type="submit" 
            id="edit-account-submit" 
            value="Edit  Account" />}
        {/* </p> */}
        {/* <p> */}
          {isPending && <input 
            type="submit" 
            id="edit-account-submit" 
            value="loading" />}
        {/* </p> */}
        {error &&<p className='account-showError'>{error}</p>}
      </form>
    </div>
  )
}
