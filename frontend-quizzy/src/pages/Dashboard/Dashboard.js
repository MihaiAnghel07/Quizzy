import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import Join_lobby_label from '../../components/menu-label/join/Join_lobby_label';
import Create_lobby_label from '../../components/menu-label/create/Create_lobby_label';
import Create_quiz_label from '../../components/menu-label/create_quiz/Create_quiz_label';
import Training_label from '../../components/menu-label/training/Training_label';
import Quizzes_label from '../../components/menu-label/quizzes/Quizzes_label';
import './Dashboard.css'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"


export default function Dashboard() {
  
  // const {user} = useAuthContext()
  const navigate = useNavigate();

  function handleJoinLobbyButtonClick() {
    navigate('/join_lobby');
  }

  function handleCreateLobbyButtonClick() {
    navigate('/create_lobby');
  }

  function handleQuizzesButtonClick() {
    navigate('/quizzes');
  }

  return (
    <div className='dashboard-container'>
      <button id='dashboard-join-lobby-button' onClick={handleJoinLobbyButtonClick}>Join Lobby</button>
      <button id='dashboard-create-lobby-button' onClick={handleCreateLobbyButtonClick}>Create Lobby</button>
      <button id='dashboard-quizzes-button' onClick={handleQuizzesButtonClick}>Quizzes</button>
    </div>
  )
}
