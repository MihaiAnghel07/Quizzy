import React, { useEffect, useState } from 'react'
import './Create_lobby.css'
import { useGenerateLobbyCode } from '../../hooks/useGenerateLobbyCode'
import { useLoadingLobbyTemplate } from '../../hooks/useLoadingLobbyTemplate'
import ShowParticipants from '../../components/showParticipants/ShowParticipants'
import Modal from '../../components/modal/Modal'
import { useCloseLobby } from '../../hooks/useCloseLobby'
import { useLocation, useNavigate } from 'react-router-dom';
import QuizzesSelection from '../QuizzesSelection/QuizzesSelection'
import { useUpdateLobby } from '../../hooks/useUpdateLobby'
import Popup from '../../components/Popup/Popup'
import { FaCheck } from 'react-icons/fa'
import { useSetHistoryInitialState } from '../../hooks/useSetHistoryInitialState'
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent'



export default function Create_lobby() {

  const { closeLobby } = useCloseLobby()
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const { updateLobby } = useUpdateLobby();
  const { setHistoryInitialState } = useSetHistoryInitialState();
  let navigate = useNavigate();
  let location = useLocation();
  const { loadLobbyTemplateToDatabase } = useLoadingLobbyTemplate()
  let error = null;

  const [duration, setDuration] = useState("10")

  const handleDurationChange = (e) => {
    const input = e.target.value;

    const validatedInputValue = input === '' ? '' : Math.min(Math.max(Number(input), 1), 60);
    setDuration(validatedInputValue.toString());
  }


  const getTimeEpoch = () => {
    return new Date().getTime().toString();                             
  }

  const delay = ms => new Promise (
    resolve => setTimeout(resolve, ms)
  );

  // generate unique lobbyCode
  const { generateLobbyCode } = useGenerateLobbyCode()
  if (localStorage.getItem('lobbyCode') === null) {
    localStorage.setItem('lobbyCode', generateLobbyCode());
    let lobbyTemplate = {
      code: localStorage.getItem('lobbyCode'),
      gameStatus: "on hold",
      host: localStorage.getItem('username'),
      noParticipants: 0,
      participants: [],
      questionIndex: 0,
      quizId: -1,
      quizAuthor: null,
      lobbyId: getTimeEpoch()
    }
    loadLobbyTemplateToDatabase(lobbyTemplate)

  }

  const [lobbyCode] = useState(localStorage.getItem("lobbyCode"));
  
  // when confirmModal modified, cloase the lobby and redirect to dashboard
  useEffect(()=>{
    if (confirmModal) {
      closeLobby(lobbyCode);
      localStorage.removeItem("lobbyCode");
      localStorage.removeItem("quizStarted");
      navigate('/dashboard', {replace: true});
    }
  }, [confirmModal])

  const selectQuizHandler = (e) => {
    e.preventDefault();
    navigate('/quizzes_selection');
  }

  const getTimestamp = () => {
    return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now())
  }

  const handleUpdateLobbyError = (errorMessage) => {
    error = errorMessage;
  };

  const startQuizHandler = async (e) => {
    e.preventDefault();

    if (location.state != null && location.state.quizId != null && location.state.quizAuthor != null && duration != '') {
      await updateLobby(lobbyCode, location.state.quizId, location.state.quizAuthor, location.state.quizTitle, duration, getTimestamp(), handleUpdateLobbyError);

      if (error == null) {
        setHistoryInitialState(lobbyCode);
        setShowPopup3(true);
        localStorage.setItem("quizStarted", true);
        // await delay(2200);
        // localStorage.removeItem("lobbyCode");
        // navigate('/dashboard', {replace: true});
      
      } else if (error != null) {
        // eroare pentru ca nu exista niciun participant
        setShowPopup2(true)
      }

    } else {
      // eroare pentru ca nu am selectat quiz
      setShowPopup(true)
    }

  }

  function handlePopupClose() {
    setShowPopup(false);
  }

  function handlePopupClose2() {
    setShowPopup2(false);
  }

  function handlePopupClose3() {
    setShowPopup3(false);
  }


  return (
    <div>
      <div className='create-lobby-navigation-component'>
        <NavigationComponent
            pageTitle="Create Lobby"
            pairs={[["Dashboard", "/dashboard"],
                    ["Create Lobby", "/create_lobby"]]}
        />
      </div>

      <h2 className='create-lobby-title'>Create Lobby</h2>
      
      <div className='create-lobby-wrapper'>

        {openModal && <div id='close-lobby-modal'>
          <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you sure you want to close the lobby?" /> </div>}
        
        {showPopup &&
        (
          <Popup
            message="Select a quiz before starting the quiz!"
            duration={2000}
            position="top-right"
            // icon = {<FaCheck className='flag-button'/>}
            onClose={handlePopupClose}
          />
        )}

        {showPopup2 &&
        (
          <Popup
            message="You cannot start the quiz with no participants in lobby"
            duration={2000}
            position="top-right"
            // icon = {<FaCheck className='flag-button'/>}
            onClose={handlePopupClose2}
          />
        )}

        {showPopup3 &&
        (
          <Popup
            message="The quiz has started!&nbsp;&nbsp;&nbsp;&nbsp;"
            duration={2000}
            position="top-right"
            // icon = {<FaCheck className='flag-button'/>}
            onClose={handlePopupClose3}
          />
        )}
        
        {localStorage.getItem("quizStarted") !== null && <h4 className='close-lobby-message'>Warning: Do not close the lobby until all participants have finished</h4>}
            
        <div className='create-lobby-content'>
          
          <div id="print-lobbyCode">Lobby Code: {lobbyCode}</div>
          
          <div id="print-quiz-title">
            {location.state?.quizId ? <h2>{"Selected Question Set: " + location.state?.quizTitle}</h2> : 
                                    <h2>No Question Set Selected</h2>}
                                    <li id='select-quiz-button' onClick={selectQuizHandler}>Select Question Set</li>
          </div>

          <div className='quiz-duration'>
            <p>Quiz duration (minutes):  </p>
            <input id='quiz-duration-input' type='number' value={duration} onChange={handleDurationChange} min="1" max="60"></input>
          </div>

          <div className='create-lobby-buttons'>
            <ul>
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
          
          
          
        </div>  
      </div>
    </div>
  )
}

