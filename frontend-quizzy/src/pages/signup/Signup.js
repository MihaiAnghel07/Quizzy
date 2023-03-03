import { BrowserRouter, NavLink } from 'react-router-dom';
import React from 'react'
import { useState } from 'react'
import './signup.css'
import { useSignup } from '../../hooks/useSignup';


export default function Signup() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, isPending, error } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password)

  }

  return (
    <div id="signup-form-wrap">
        <h2>Sign up</h2>
        <form id="signup-form" onSubmit={handleSubmit}>
            <p>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={(e) => setEmail(e.target.value)} 
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
              required />
              <i className="validation"></i>
            </p>
            <p>
             {!isPending && <input 
              type="submit" 
              id="signup" 
              value="Sign up" />}
            </p>
            <p>
            {isPending && <input 
              type="submit" 
              id="signup" 
              value="loading" />}
            </p>
            {error &&<p className='showError'>{error}</p>}
        </form>

        <div id="login-account-wrap">
            <p>Already have an account? 
              <BrowserRouter forceRefresh>
                <NavLink exact to="/login">Login here</NavLink>
              </BrowserRouter>
            </p>
        </div>
    </div>
  )
}
