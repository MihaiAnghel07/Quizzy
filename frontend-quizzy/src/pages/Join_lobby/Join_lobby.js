import React from 'react'
import './Join_lobby.css'
import { useState } from 'react'


export default function Join_lobby() {

  const [lobbyCode, setLobbyCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(lobbyCode)
    //login(email, password)
  }

  return (
    <div className='join-lobby-wrapper'>
      <div className='join-lobby-content'>
        <form className='join-lobby-form' onSubmit={handleSubmit}>
        <p>
          <input 
            type="input" 
            id="join-lobby-input" 
            name="join-lobby-code" 
            placeholder="Lobby Code" 
            onChange={(e) => setLobbyCode(e.target.value)} 
            value={lobbyCode}
            required />
            <i className="validation"></i>
        </p>

        <p>
          <input 
            type="submit" 
            id="join-lobby-submit" 
            value="Join Lobby" />
        </p>

        </form>
      </div>
      
    </div>
  )
}
