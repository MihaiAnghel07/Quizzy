import { useLocation, useNavigate } from 'react-router-dom';
import BouncingDotsLoader from '../../components/BouncingDotsLoader/BouncingDotsLoader'
import './ParticipantLobby.css'
import React from 'react'
import { projectFirebaseRealtime } from '../../firebase/config'
import { useEffect } from 'react';


class ParticipantLobby extends React.Component {

    constructor(props) {
        super(props);
        this.ref=projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode)
        this.ref2=projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode + '/gameStatus');
        

        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
    }
    
    componentWillUnmount() {
        this.ref.off('value', this.handleSnapshot);
        this.ref2.off('value', this.handleSnapshot2);
    }

    componentDidMount() {

        this.ref.on('value', this.handleSnapshot);     
        this.ref2.on('value', this.handleSnapshot2);

    } 

    handleSnapshot = (snapshot) => {
        if (!snapshot.exists()) {
          alert("The lobby was canceled by the host!");
          this.props.canceledHandler();
        }
    };

    handleSnapshot2 = (snapshot) => {
        if (snapshot.exists() && snapshot.val() === 'in progress') {
            this.props.myNavigateHandler();
        }
    };

    render() {

        return (
            <div className='participant-lobby-wrapper'>
                <div className='participant-lobby-content'>
                    <h4>Waiting for quiz to start </h4>
                    <div id='bouncing-dots-loader'><BouncingDotsLoader/></div>
                </div>
            </div>
        )
    }

}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        let location = useLocation();
        let navigate = useNavigate();

        // const queryParams = new URLSearchParams(location.search);
        // const lobbyCode = queryParams.get('lobbyCode');
 

        const canceledHandler = () => {
            //localStorage.setItem("quizAttempt", 2);
            navigate('/dashboard', {replace: true});
        }

        const myNavigate = () => {
            //localStorage.setItem("quizAttempt", 2);
            navigate('/quiz', {state:{lobbyCode:location.state.lobbyCode}, replace:true})
        }


        function handleBeforeUnload(event) {
            // Display a confirmation dialog to ask the user if they want to leave
            let leavePage = window.confirm('Are you sure you want to leave this page?');
            console.log(leavePage)
            
            if (!leavePage) {
                
                // If the user chooses to stay, prevent the default behavior of the beforeunload event
                console.log(event)
                event.preventDefault();
                window.history.pushState(null, document.title, location.href);
                
            } else {
                localStorage.removeItem("currentQuestionCount");
                localStorage.removeItem("quizDuration");
                sessionStorage.removeItem("quizOnGoing");
                localStorage.removeItem("alertTime");
            }
            
        }


        useEffect(() => {
            window.addEventListener('popstate', handleBeforeUnload, {capture:true});
            window.addEventListener('beforeunload', handleBeforeUnload, {capture:true});
      
            return () => {
                window.addEventListener('popstate', handleBeforeUnload, {capture:true});
                window.removeEventListener('beforeunload', handleBeforeUnload, {capture:true});
            };
        }, []);
       



        

        
            // useEffect(() => {
            //     const handleBeforeUnload = (event) => {
            //         event.preventDefault();
            //         event.returnValue = ''; // This value is ignored by most modern browsers
            //     };

            //     window.addEventListener('beforeunload', handleBeforeUnload);
            //     window.addEventListener('popstate', handleBeforeUnload);

            //     return () => {
            //         window.removeEventListener('beforeunload', handleBeforeUnload);
            //         window.addEventListener('popstate', handleBeforeUnload);
            //     };
                
            // }, []);

            // const handleNavigation = (event) => {
            //     event.preventDefault();
            //     const confirmationMessage = 'Are you sure you want to leave this page?';
            //     event.returnValue = confirmationMessage;
            //     return confirmationMessage;
            // };

            // useEffect(() => {
            //     const handleTabClose = () => {
            //       const confirmationMessage = 'Are you sure you want to leave this page?';
            //       // Customize the confirmation dialog appearance using your own UI
            //       const userConfirmation = window.confirm(confirmationMessage);
            
            //       if (!userConfirmation) {
            //         const newUrl = `${window.location.origin}/participant_lobby`; // Provide a fallback URL to stay on the page
            //         window.open(newUrl, '_self');
            //       }
            //     };
            
            //     window.addEventListener('beforeunload', handleTabClose);
            
            //     return () => {
            //       window.removeEventListener('beforeunload', handleTabClose);
            //     };
            //   }, []);

        
        

        return <Component lobbyCode={location.state.lobbyCode} myNavigateHandler={myNavigate} canceledHandler={canceledHandler}/>
    }
}

export default wrapClass(ParticipantLobby); 
