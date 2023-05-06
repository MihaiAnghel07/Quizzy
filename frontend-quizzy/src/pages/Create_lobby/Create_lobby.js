import React, { useEffect, useState, useMemo } from 'react'
import './Create_lobby.css'
import { useGenerateLobbyCode } from '../../hooks/useGenerateLobbyCode'
import { useLoadingLobbyTemplate } from '../../hooks/useLoadingLobbyTemplate'
import ShowParticipants from '../../components/showParticipants/ShowParticipants'
import Modal from '../../components/modal/Modal'
import { useCloseLobby } from '../../hooks/useCloseLobby'
import { useLocation, useNavigate } from 'react-router-dom';
import QuizzesSelection from '../QuizzesSelection/QuizzesSelection'
import { useUpdateLobby } from '../../hooks/useUpdateLobby'



export default function Create_lobby() {

  const { closeLobby } = useCloseLobby()
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { updateLobby } = useUpdateLobby();
  const { loadLobbyTemplateToDatabase } = useLoadingLobbyTemplate()

  let navigate = useNavigate();
  let location = useLocation();
  // generate unique lobbyCode
  const { generateLobbyCode } = useGenerateLobbyCode()
  if (sessionStorage.getItem('lobbyCode') === null) {
    sessionStorage.setItem('lobbyCode', generateLobbyCode());
    let lobbyTemplate = {
      code: sessionStorage.getItem('lobbyCode'),
      gameStatus: "on hold",
      host: sessionStorage.getItem('username'),
      noParticipants: 0,
      participants: [],
      questionIndex: 0,
      quizId: -1,
      quizAuthor: null
    }
    loadLobbyTemplateToDatabase(lobbyTemplate)
  }

  const [lobbyCode] = useState(sessionStorage.getItem("lobbyCode"));
  
  // when confirmModal modified, cloase the lobby and redirect to dashboard
  useEffect(()=>{
    if (confirmModal) {
      closeLobby(lobbyCode);
      sessionStorage.removeItem("lobbyCode");
      navigate('/dashboard', {replace: true});
    }
  }, [confirmModal])

  const selectQuizHandler = (e) => {
    e.preventDefault();
    navigate('/quizzes_selection');
  }

  const startQuizHandler = (e) => {
    e.preventDefault();
    updateLobby(lobbyCode, location.state.quizId, location.state.quizAuthor);
    // navigate to waiting page
    // TODO

    // navigate('/quiz', {state: {quizId:location.state.quizId,
    //                           quizTitle:location.state.quizTitle,
    //                           quizAuthor:location.state.quizAuthor}});

  }

  return (
    <div className='create-lobby-wrapper'>
      <div className='create-lobby-content'>
        <div id="print-lobbyCode">Lobby Code: {lobbyCode}</div>
        <div id="print-quiz-title">
          {location.state?.quizId ? <h2>{"Selected Quiz: " + location.state?.quizTitle}</h2> : 
                                  <h2>No quiz selected</h2>}
        </div>
        <div className='create-lobby-buttons'>
        <ul>
          <li id='select-quiz-button' onClick={selectQuizHandler}>Select Quiz</li>
          <li id='start-quiz-button' onClick={startQuizHandler}>Start Quiz</li>
          <li id='close-lobby-button' onClick={setOpenModal}>Close Lobby</li>
        </ul>
        </div>
        <div className="show-participants-container">
          <caption id="participants">Participants</caption>
          <div className='show-participants'>
            <ShowParticipants lobbyCode={lobbyCode} />
          </div>
        </div>
        
        {openModal && <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you sure you want to close the lobby?" />}
        
      </div>  
    </div>
  )
}

