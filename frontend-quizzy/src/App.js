import { BrowserRouter, Navigate, Redirect, Route, Routes } from 'react-router-dom';
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
import Participant_lobby from './pages/Participant_lobby/Participant_lobby';



function App() {

  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter >
      
        {user && <MySidebar />}
        <div className="body">  
          <Navbar />
          
          <Routes>
            <Route path="/" element={ user ? <Dashboard /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : (<div className='login-page'><Login /></div>)} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : (<div className='signup-page'><Signup /></div>)}/>
            <Route path="/dashboard" element= {user? <Dashboard /> : < Login/>} />
            <Route path="/account" element= {user? <Account /> : < Login/>} />
            {/* <Route path="/faq" element= {user ? <FAQ /> : < Login/>} />*/}
            <Route path="/contact" element= {user? <Contact /> : < Login/>} /> 
            <Route path="/join_lobby" element= {user? <Join_lobby /> : < Login/>} />
            <Route path="/create_lobby" element= {user? <Create_lobby /> : < Login/>} />
            <Route path="/create_quiz" element= {user? <Create_quiz /> : < Login/>} />
            <Route path="/quizzes" element= {user? <Quizzes /> : < Login/>} />
            <Route path="/participant_lobby" element= {user? <Participant_lobby /> : < Login/>} />
            
          </Routes>

          {!user && <Footer />}
        </div>
        
      </BrowserRouter>
    </div>
  );
}


export default App;
