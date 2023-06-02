import React from 'react'
import './ShowHostHistory.css'
import { useNavigate } from 'react-router-dom';


class ShowHostHistory extends React.Component {

    constructor() {
        super();
        this.state = {
            records: [],
            averageScore: 0,
            numberOfQuestions: 0
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        let records = [];
        let scoreSum = 0;
        let numberOfQuestions = 0;

        Object.keys(this.props.data).map((key) => {
            if (key !== 'timestamp' && key !== 'quizTitle' && key !== 'feedbacks' && key !== 'ratings') {
                //salvez doar datele ce tin de participanti
                records.push({key: key, data: this.props.data[key]})
                
                // aflu media punctajelor
                let questions = Object.values(this.props.data[key].questions);
                numberOfQuestions = questions.length;
                let participantScore = 0;
                for (let i = 0; i < questions.length; i++) {
                    if ((questions[i].answer1.isSelected && questions[i].answer1.isCorrect)
                        || (questions[i].answer2.isSelected && questions[i].answer2.isCorrect)
                        || (questions[i].answer3.isSelected && questions[i].answer3.isCorrect)
                        || (questions[i].answer4.isSelected && questions[i].answer4.isCorrect)) {
                            participantScore++;
                        }
                }
                scoreSum += participantScore;

                // de calculat rating + feedback

            }
        })

        let averageScore = scoreSum / records.length;
        this.setState({records: records, averageScore: averageScore, numberOfQuestions: numberOfQuestions});
    }

    render() {
        return (
            <div className='show-host-history-wrapper'>
                <div className='show-host-history-summary'>Summary</div>
                <ul className='show-host-history-summary-list'>
                    <li className='show-host-history-total-participants'>Number of participants: {this.state.records.length}</li>
                    <li className='show-host-history-total-questions'>Number of questions: {this.state.numberOfQuestions}</li> 
                    <li className='show-host-history-average-score'>Average score: {this.state.averageScore}</li> 
                </ul>

                {this.state.records.length === 0 && <div>No data found!</div>}
            
                <div className='show-host-history-participants'>Participants list (for details, click on participant name):
                    {this.state.records.length !== 0 &&
                        this.state.records.map((participant, index) => {
                            
                            return (
                                <div key={participant.key} className='show-host-history-wrapper'>
                                    <div>
                                        <div className='show-host-history-participant-item' onClick={()=>this.props.participantRaportHandler(participant.key)}>{index + 1}. {participant.key}</div> 
                                    </div>
                                </div>
                            )
                        })
                    }  
                </div>

            </div>
        )
    }
}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        let navigate = useNavigate();
        
        const participantRaportHandler = (participant) => {
            navigate('/participant_raport', {state:{participant:participant, quizId:props.quizId}});
        }

        return <Component data={props.data}
                        participantRaportHandler={participantRaportHandler} />
    }
}

export default wrapClass(ShowHostHistory); 