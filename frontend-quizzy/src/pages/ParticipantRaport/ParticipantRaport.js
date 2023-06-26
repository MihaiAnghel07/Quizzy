import React from 'react'
import './ParticipantRaport.css'
import { useLocation } from 'react-router-dom';
import ShowParticipantHistory from '../../components/ShowParticipantHistory/ShowParticipantHistory';
import { projectFirebaseRealtime } from '../../firebase/config'
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';

class ParticipantRaport extends React.Component {
  
    constructor() {
        super();
        this.state = {
            records: []
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        let host = localStorage.getItem("username");
        const ref = projectFirebaseRealtime.ref('History/host/' + host + "/quizzes/" + this.props.quizId + "/" + this.props.participant);
        ref.once('value', (snapshot) => {
            if (snapshot.exists()) {
                let records = [];
                snapshot.forEach(childSnapshot => {
                    let key = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({"key":key, "data":data}); 
                })
                this.setState({records: records});
            }
        })

    }


    render() {
        return (
            <div className='participant-raport-wrapper'>
                
                <div className='participant-raport-navigation-component'>
                    <NavigationComponent
                        pageTitle="Participant Report"
                        pairs={[['History', '/history'],
                                ['Quiz Report', '/quiz_raport'],
                                ['Participant Report', '/participant_raport']
                        ]}
                    />
                </div>

                <h2 className='participant-raport-title'>Participant Report</h2>

                {this.state.records.map((el) => {
                    if (el.key === "questions") {
                        return (
                            <div className="show-participant-raport" key={el.key}>
                                <ShowParticipantHistory questions={el.data} quizId={this.props.quizId} participant={this.props.participant}/>
                            </div>
                        )
                    }

                })}
                
            </div>
        )
    }
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        let location = useLocation();

        return <Component quizId={location.state.quizId} participant={location.state.participant}/>
    }
}

export default wrapClass(ParticipantRaport); 