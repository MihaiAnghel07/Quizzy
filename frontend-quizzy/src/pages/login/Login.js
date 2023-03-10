import { Link } from 'react-router-dom';
import React from 'react'
import { useState } from 'react'
import './login.css'
import { useLogin } from '../../hooks/useLogin'
import axios from '../../api/axios';

const LOGIN_URL = '/login'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email, password)
    login(email, password)
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
          {!isPending && <input 
            type="submit" 
            id="login" 
            value="Login" />}
        </p>
        <p>
          {isPending && <input 
            type="submit" 
            id="login" 
            value="loading" />}
        </p>
        {error &&<p className='showError'>{error}</p>}
      </form>

      <div id="create-account-wrap">
        <p>Not a member? 
            <Link to="/signup">Create Account</Link>
        </p>
      </div>
  </div>
  )
}
