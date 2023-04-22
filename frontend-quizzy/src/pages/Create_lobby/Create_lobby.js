import React from 'react'
import './Create_lobby.css'
import { useGenerateLobbyCode } from '../../hooks/useGenerateLobbyCode'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLoadingLobbyTemplate } from '../../hooks/useLoadingLobbyTemplate'
import { useState } from "react";
import { useGetParticipants } from '../../hooks/useGetParticipants'
import { Table } from 'react-bootstrap'
import ShowParticipants from '../../components/showParticipants/ShowParticipants'



export default function Create_lobby() {

  //const {user} = useAuthContext

  // generate unique lobbyCode
  const { generateLobbyCode } = useGenerateLobbyCode()
  const lobbyCode = generateLobbyCode();

  let lobbyTemplate = {
    code: lobbyCode,
    gameStatus: "on hold",
    host: sessionStorage.getItem('user'),
    noParticipants: 0,
    participants: [],
    questionIndex: 0,
    questionSet: []
  }

  // load the lobby template to database
  const { loadLobbyTemplateToDatabase } = useLoadingLobbyTemplate()
  loadLobbyTemplateToDatabase(lobbyTemplate)

  // fetch lobby participants
  //const { getParticipants } = useGetParticipants();
  //let participants = getParticipants(lobbyCode)


  return (
    <div className='create-lobby-wrapper'>
      <div className='create-lobby-content'>
        <div id="print-lobbyCode">Lobby Code: {lobbyCode}</div>
        
        <ul className='create-lobby-buttons'>
          <li id='select-quiz-button'>Select Quiz</li>
          <li id='start-quiz-button'>Start Quiz</li>
        </ul>
      
        <div className="show-participants">
          <ShowParticipants lobbyCode={lobbyCode} />
        </div>
      </div>      
    </div>
  )
}
