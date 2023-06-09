import {React, useState} from 'react'
import './Join_lobby.css'
import { useJoinLobby } from '../../hooks/useJoinLobby'
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent'


export default function Join_lobby() {

  const [lobbyCode, setLobbyCode] = useState('')
  const { join, error, isPending } = useJoinLobby()

  const handleSubmit = (e) => {
    e.preventDefault()
    join(lobbyCode)

  }

  return (
    <div>
      <div className='join-lobby-navigation-component'> 
        <NavigationComponent
            pageTitle="Join Lobby"
            pairs={[["Dashboard", "/dashboard"],
                    ["Join Lobby", "/join_lobby"]]}
        />
      </div>

      
      
      <div className='join-lobby-wrapper'>
        
        <h2 className='join-lobby-title'>Join Lobby</h2>

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

    </div>
  )
}
