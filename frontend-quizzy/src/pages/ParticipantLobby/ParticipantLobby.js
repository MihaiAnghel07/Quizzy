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
                    <h4 className='participant-lobby-wrapper-note'>
                        Note:  During the quiz do not use Back / Forward / Close tab buttons. 
                        {/* Undefined behavior may lead to loss of score. */}

                    </h4>
                    <h4 className='participant-lobby-wrapper-waiting'>Waiting for quiz to start </h4>
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
 

        const canceledHandler = () => {
            navigate('/dashboard', {replace: true});
        }

        const myNavigate = () => {
            navigate('/quiz', {state:{lobbyCode:location.state.lobbyCode}, replace:true})
        }


        return <Component lobbyCode={location.state.lobbyCode} myNavigateHandler={myNavigate} canceledHandler={canceledHandler}/>
    }
}

export default wrapClass(ParticipantLobby); 
