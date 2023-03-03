import { BrowserRouter, NavLink } from 'react-router-dom';
import React from 'react'
import { useState } from 'react'
import './login.css'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const user = {
    email: email,
    password: password
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email, password)
    user.email = email;
    user.password = password;

  }

  return (
    <div id="login-form-wrap">
      <h2>Login</h2>
      <form id="login-form" onSubmit={handleSubmit}>
        <p>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email}
          required />
          <i className="validation"></i>
        </p>
        <p>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required />
          <i className="validation"></i>
        </p>
        <p>
        <input 
          type="submit" 
          id="login" 
          value="Login" />
        </p>
      </form>

      <div id="create-account-wrap">
        <p>Not a member? 
          <BrowserRouter forceRefresh>
              <NavLink exact to="/signup">Create Account</NavLink>
          </BrowserRouter>
        </p>
      </div>
  </div>
  )
}
