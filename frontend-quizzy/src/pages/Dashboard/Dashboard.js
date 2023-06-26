import React from 'react'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"


export default function Dashboard() {
  localStorage.setItem("selectedButton", "dashboard");
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
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='dashboard-wrapper'
      >

      <h2 className='dashboard-title'>Dashboard</h2>

      <div className='dashboard-container'>
        <button id='dashboard-join-lobby-button' onClick={handleJoinLobbyButtonClick}>Join Lobby</button>
        <button id='dashboard-create-lobby-button' onClick={handleCreateLobbyButtonClick}>Create Lobby</button>
        <button id='dashboard-quizzes-button' onClick={handleQuizzesButtonClick}>Question Sets</button>
      </div>

    </motion.div>
  )
}
