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
              {/* {!user && } */}
              {/* {user && <Dashboard />} */}

            <Route path="/login" element={user ? <Navigate to="/" /> : (<div className='login-page'><Login /></div>)} />
              {/* {!user && <div className='login-page'><Login /></div>}
              {user && <Navigate to="/" />} */}
          
            <Route path="/signup" element={user ? <Navigate to="/" /> : (<div className='signup-page'><Signup /></div>)}/>
              {/* {!user && <div className='signup-page'><Signup /></div>}
              {user && <Navigate to="/" />} */}

            {/* <Route path="/dashboard" element={<Navigate to="/login" />}/> */}
              {/* {!user && <Navigate to="/login" />}
              {user && <Dashboard />} */}
            
            <Route path="/dashboard" element= {user? <Dashboard /> : < Login/>} />
            <Route path="/account" element= {user? <Account /> : < Login/>} />
            {/* <Route path="/faq" element= {user ? <FAQ /> : < Login/>} />*/}
            <Route path="/contact" element= {user? <Contact /> : < Login/>} /> 
            <Route path="/join_lobby" element= {user? <Join_lobby /> : < Login/>} />
            <Route path="/create_lobby" element= {user? <Create_lobby /> : < Login/>} />
            
          </Routes>

          {!user && <Footer />}
        </div>
        
      </BrowserRouter>
    </div>
  );
}


export default App;
