import { BrowserRouter, Navigate, Redirect, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Dashboard from './pages/Dashboard/Dashboard'
import Navbar from './components/navbar/Navbar';
import MySidebar from './components/MySidebar/MySidebar';
import Footer from './components/footer/Footer';
import { useAuthContext } from './hooks/useAuthContext';
import Account from './pages/Account/Account';
import Join_lobby from './pages/Join_lobby/Join_lobby';
import Create_lobby from './pages/Create_lobby/Create_lobby';
import Contact from './pages/Contact/Contact';
import Create_quiz from './pages/Create_quiz/Create_quiz';
import Quizzes from './pages/Quizzes/Quizzes';
import Quiz from './pages/Quiz/Quiz';
import ParticipantLobby from './pages/ParticipantLobby/ParticipantLobby';
import UpdateQuiz from './pages/UpdateQuiz/UpdateQuiz';
import QuizzesSelection from './pages/QuizzesSelection/QuizzesSelection';
import PopupTest from './pages/PopupTest/PopupTest';
import { AddQuestion } from './pages/AddQuestion/AddQuestion';
import Faq from './pages/Faq/Faq';
import { useState } from 'react';
import { useEffect } from 'react';
import Modal from './components/modal/Modal';
import History from './pages/History/History';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import ParticipantRaport from './pages/ParticipantRaport/ParticipantRaport';
import StatisticsPerQuestion from './pages/StatisticsPerQuestion/StatisticsPerQuestion';
import ViewFeedbacks from './pages/ViewFeedbacks/ViewFeedbacks';




function App() { 

  const { user } = useAuthContext()
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { dispatch } = useAuthContext()
  let navigate = useNavigate();


  // when confirmModal modified, cloase the lobby and redirect to dashboard
  useEffect(()=>{
    if (confirmModal) {
      setConfirmModal(false)
      setOpenModal(false)
      dispatch({ type: 'LOGOUT' })
      navigate('/login', {replace:true})
    }

  }, [confirmModal])   


  return (
    <div className="App">
      
        {user && <MySidebar setOpenModal={setOpenModal}/>}
        <div className="body" style={{ marginLeft: user ? '250px' : '0px' }}>  
        
        {openModal && <div id='exit-modal'> 
          <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you sure you want to exit?" /> </div>}
          
          {!user && <Navbar />}
          
          <Routes>
            <Route path="/" element={ user ? <Dashboard /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : (<div className='login-page'><Login /></div>)} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : (<div className='signup-page'><Signup /></div>)}/>
            <Route path="/dashboard" element= {user? <Dashboard /> : < Login/>} />
            <Route path="/account" element= {user? <Account /> : < Login/>} />
            <Route path="/contact" element= {user? <Contact /> : < Login/>} /> 
            <Route path="/join_lobby" element= {user? <Join_lobby /> : < Login/>} />
            <Route path="/create_lobby" element= {user? <Create_lobby /> : < Login/>} />
            <Route path="/create_quiz" element= {user? <Create_quiz /> : < Login/>} />
            <Route path="/quizzes" element= {user? <Quizzes /> : < Login/>} />
            <Route path="/participant_lobby" element= {user? <ParticipantLobby /> : < Login/>} />
            <Route path="/update_quiz" element= {user? <UpdateQuiz /> : < Login/>} />
            <Route path="/quiz" element= {user? <Quiz /> : < Login/>} />
            <Route path="/quizzes_selection" element= {user? <QuizzesSelection /> : < Login/>} />
            <Route path="/popuptest" element= {user? <PopupTest /> : < Login/>} />
            <Route path="/add_question" element= {user? <AddQuestion /> : < Login/>} />
            <Route path="/faq" element= {user? <Faq /> : < Login/>} />
            <Route path="/history" element= {user? <History /> : < Login/>} />
            <Route path="/change_password" element= {user? <ChangePassword /> : < Login/>} />
            <Route path="/participant_raport" element= {user? <ParticipantRaport /> : < Login/>} />
            <Route path="/statistics_per_question" element= {user? <StatisticsPerQuestion /> : < Login/>} />
            <Route path="/view_feedbacks" element= {user? <ViewFeedbacks /> : < Login/>} />
            
          </Routes>
          
          {!user && <Footer />}
          
        </div>
        
      
    </div>
  );
}


export default App;
