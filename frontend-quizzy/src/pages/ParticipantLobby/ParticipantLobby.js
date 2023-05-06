import { useLocation, useNavigate } from 'react-router-dom';
import BouncingDotsLoader from '../../components/BouncingDotsLoader/BouncingDotsLoader'
import './ParticipantLobby.css'
import React from 'react'
import { projectFirebaseRealtime } from '../../firebase/config'


class ParticipantLobby extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {

        const ref = projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode + '/gameStatus');
        ref.on('value', (snapshot) => {
            if (snapshot.exists() && snapshot.val() === 'in progress') {
                this.props.myNavigateHandler();
            }
        })

    } 

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

        const myNavigate = () => {
            navigate('/quiz', {state:{lobbyCode:location.state.lobbyCode}})
        }

        return <Component lobbyCode={location.state.lobbyCode} myNavigateHandler={myNavigate}/>
    }
}

export default wrapClass(ParticipantLobby); 
