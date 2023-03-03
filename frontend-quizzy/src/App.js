import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import FirstPage from './pages/FirstPage'
import logo from './assets/logo.jpg'
import { FaGithub } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';


function App() {
  
  return (
    <div className="App">
      <BrowserRouter forceRefresh>
        <nav>
          <div>
            <img className="logo" src={logo}/>
          </div>

          <div className="NavLinks">
            <NavLink exact to="/" id="home">Home</NavLink>
            <NavLink to="/login" id="login">Login</NavLink>
            <NavLink to="/signup" id="signup">Signup</NavLink>
            <NavLink to="/firstpage" id="first">FirstPage</NavLink>
          </div>
        </nav>
        
        <div className="body">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route path="/login">
              <div className='login-page'><Login /></div>
            </Route>

            <Route path="/signup">
              <div className='signup-page'><Signup /></div>
            </Route>

            <Route path="/firstpage">
              <FirstPage name='lalal'/>
            </Route>
          </Switch>

        </div>
      </BrowserRouter>

      <div className='footer'>
        <p className='footer-copyright'>Copyright &copy; 2023 Quizzy</p>
        <p className='footer-terms'>Terms</p>
        <h3 className='footer-github'><FaGithub /></h3>
        <h3 className='footer-facebook'><FaFacebook /></h3>
      </div>
    </div>
  );
}


export default App;
