import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import Join_lobby_label from '../../components/menu-label/join/Join_lobby_label';
import Create_lobby_label from '../../components/menu-label/create/Create_lobby_label';
import Create_quiz_label from '../../components/menu-label/create_quiz/Create_quiz_label';
import Training_label from '../../components/menu-label/training/Training_label';
import './Dashboard.css'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"


export default function Dashboard() {
  
  const {user} = useAuthContext()

  return (
    <motion.div className="Dashboard" 
      initial={{opacity:0}}
      animate={{opacity:1}} 
      exit={{opacity:0}}>
      <h4>Hello from Dashboard! {user.email}</h4>
     
      <ul className='labels'>
        <li><Link to="/join_lobby" id="join_lobbyID"><Join_lobby_label /> </Link></li>
        <li><Link to="/create_lobby" id="create_lobbyID"><Create_lobby_label /></Link> </li>
        <li><Link to="/create_quiz" id="create_quizID"><Create_quiz_label /></Link> </li>
        <li><Training_label /> </li>
      </ul>
      
    </motion.div>
  )
}
