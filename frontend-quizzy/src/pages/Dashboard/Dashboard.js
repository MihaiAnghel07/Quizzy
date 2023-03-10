import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import Join_lobby_label from '../../components/menu-label/join/Join_lobby_label';
import Create_lobby_label from '../../components/menu-label/create/Create_lobby_label';
import Training_label from '../../components/menu-label/training/Training_label';
import './Dashboard.css'
import Join_lobby from '../Join_lobby/Join_lobby';
import { Link } from 'react-router-dom';


export default function Dashboard() {
  
  const {user} = useAuthContext()

  return (
    <div className="Dashboard">
      <h4>Hello from Dashboard! </h4>
     
      <ul className='labels'>
        <li><Link to="/join_lobby" id="join_lobbyID"><Join_lobby_label /> </Link></li>
        <li><Link to="/create_lobby" id="create_lobbyID"><Create_lobby_label /></Link> </li>
        <li><Training_label /> </li>
      </ul>
      
    </div>
  )
}
