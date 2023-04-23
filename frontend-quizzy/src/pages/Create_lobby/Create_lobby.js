import React, { useEffect } from 'react'
import './Create_lobby.css'
import { useGenerateLobbyCode } from '../../hooks/useGenerateLobbyCode'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLoadingLobbyTemplate } from '../../hooks/useLoadingLobbyTemplate'
import { useState } from "react";
import ShowParticipants from '../../components/showParticipants/ShowParticipants'
import Modal from '../../components/modal/Modal'
import { useCloseLobby } from '../../hooks/useCloseLobby'
import { useNavigate } from 'react-router-dom';



export default function Create_lobby() {

  // generate unique lobbyCode
  const { generateLobbyCode } = useGenerateLobbyCode()
  const [lobbyCode] = useState(generateLobbyCode());

  let lobbyTemplate = {
    code: lobbyCode,
    gameStatus: "on hold",
    host: sessionStorage.getItem('user'),
    noParticipants: 0,
    participants: [],
    questionIndex: 0,
    questionSet: []
  }

  let navigate = useNavigate();

  // load the lobby template to database
  const { loadLobbyTemplateToDatabase } = useLoadingLobbyTemplate()
  loadLobbyTemplateToDatabase(lobbyTemplate)

  const { closeLobby } = useCloseLobby()
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  
  // when confirmModal modified, cloase the lobby and redirect to dashboard
  useEffect(()=>{
    if (confirmModal) {
      closeLobby(lobbyCode);
      navigate("/dashboard");
    }
  }, [confirmModal])


  return (
    <div className='create-lobby-wrapper'>
      <div className='create-lobby-content'>
        <div id="print-lobbyCode">Lobby Code: {lobbyCode}</div>
        
        <ul className='create-lobby-buttons'>
          <li id='select-quiz-button'>Select Quiz</li>
          <li id='start-quiz-button'>Start Quiz</li>
          <li id='close-lobby-button' onClick={setOpenModal}>Close Lobby</li>
        </ul>

        {openModal && <Modal closeModal={setOpenModal} yesModal={setConfirmModal} />}
        
        <div className="show-participants">
          <ShowParticipants lobbyCode={lobbyCode} />
        </div>
      </div>      
    </div>
  )
}

