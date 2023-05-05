import {React, useState} from 'react'
import './Join_lobby.css'
import { useJoinLobby } from '../../hooks/useJoinLobby'
import { useNavigate } from 'react-router-dom';


export default function Join_lobby() {

  const [lobbyCode, setLobbyCode] = useState('')
  const { join, error, isPending } = useJoinLobby()
  let navigate = useNavigate()

  const delay = ms => new Promise (
    resolve => setTimeout(resolve, ms)
  );

  const handleSubmit = async (e) => {
    e.preventDefault()
    join(lobbyCode)
    await delay(700);
    
    if (error == null)
      navigate('/participant_lobby');
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
        {error && <p className='showError'>{error}</p>}
        <p>
          {!isPending && <input 
            type="submit" 
            id="join-lobby-submit" 
            value="Join Lobby" />}
        </p>

        <p>
          {isPending && <input 
            type="submit" 
            id="join-lobby-submit" 
            value="loading" />}
        </p>
        

        </form>
      </div>
      
    </div>
  )
}
