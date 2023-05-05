import React, { useEffect, useState, useMemo } from 'react'
import './Create_lobby.css'
import { useGenerateLobbyCode } from '../../hooks/useGenerateLobbyCode'
import { useLoadingLobbyTemplate } from '../../hooks/useLoadingLobbyTemplate'
import ShowParticipants from '../../components/showParticipants/ShowParticipants'
import Modal from '../../components/modal/Modal'
import { useCloseLobby } from '../../hooks/useCloseLobby'
import { useLocation, useNavigate } from 'react-router-dom';
import QuizzesSelection from '../QuizzesSelection/QuizzesSelection'



export default function Create_lobby() {

  const { closeLobby } = useCloseLobby()
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [quizId, setQuizId] = useState(-1)
  const [quizAuthor, setQuizAuthor] = useState(null)
  let navigate = useNavigate();
  let location = useLocation();
  // generate unique lobbyCode
  const { generateLobbyCode } = useGenerateLobbyCode()
  if (sessionStorage.getItem('lobbyCode') === null)
    sessionStorage.setItem('lobbyCode', generateLobbyCode());

  const [lobbyCode] = useState(sessionStorage.getItem("lobbyCode"));
  
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

    console.log("quizId = " + location.state.quizId)
    console.log("quizTitle = " + location.state.quizTitle)
    navigate('/quiz', {state: {quizId:location.state.quizId,
                              quizTitle:location.state.quizTitle,
                              quizAuthor:location.state.quizAuthor}});

  }

  return (
    <div className='create-lobby-wrapper'>
      <div className='create-lobby-content'>
        <div id="print-lobbyCode">Lobby Code: {lobbyCode}</div>
        <div id="print-quiz-title">
          {location.state?.quizId ? <h2>{"Selected Quiz: " + location.state?.quizTitle}</h2> : 
                                  <h2>No quiz selected</h2>}
        </div>
        <ul className='create-lobby-buttons'>
          <li id='select-quiz-button' onClick={selectQuizHandler}>Select Quiz</li>
          <li id='start-quiz-button' onClick={startQuizHandler}>Start Quiz</li>
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

