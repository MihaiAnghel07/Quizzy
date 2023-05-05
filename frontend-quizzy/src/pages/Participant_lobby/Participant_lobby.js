import { useNavigate } from 'react-router-dom';
import BouncingDotsLoader from '../../components/BouncingDotsLoader/BouncingDotsLoader'
import './Participant_lobby.css'
import React from 'react'
import { projectFirebaseRealtime } from '../../firebase/config'


class Participant_lobby extends React.Component() {

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
            if (snapshot.exists()) {
                console.log(snapshot)
                // let records = [];
                // snapshot.forEach(childSnapshot => {
                //     let key = childSnapshot.key;
                //     let data = childSnapshot.val();
                //     records.push({"key":key, "data":data}); 
                // })
                // this.setState({quizzesData: records});
            }
        })

    } 

    render() {

        return (
            <div className='participant-lobby-wrapper'>
                <div className='participant-lobby-content'>
                    <h4>Waiting for quiz starting </h4>
                    <div id='bouncing-dots-loader'><BouncingDotsLoader/></div>
                    
                </div>
            </div>
        )
    }

}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        let navigate = useNavigate();
        console.log(props.lobbyCode);
        

        return <Component lobbyCode={props.lobbyCode}/>
    }
}

export default wrapClass(Participant_lobby); 
