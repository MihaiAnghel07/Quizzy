import React, { useEffect } from 'react'
import './ShowHistory.css'
import { projectFirebaseRealtime } from '../../firebase/config'
import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import ShowParticipantHistory from '../ShowParticipantHistory/ShowParticipantHistory';
import ShowHostHistory from '../ShowHostHistory/ShowHostHistory';


class ShowHistory extends React.Component {

    constructor() {
        super();
        this.state = {
            historyData: [],
            username: localStorage.getItem("username")
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    componentDidMount() {
        
        let ref;
        if (this.props.historyType === "participant") {
            ref = projectFirebaseRealtime.ref('History/participant/' + this.state.username + '/quizzes');
        
        } else if (this.props.historyType === "host") {
            ref = projectFirebaseRealtime.ref('History/host/' + this.state.username + '/quizzes');
        }

        ref.on('value', (snapshot) => {
            if (snapshot.exists()) {
                let records = [];
                snapshot.forEach(childSnapshot => {
                    let key = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({"key":key, "data":data}); 
                })
                this.setState({historyData: records});
                this.props.setQuizDataFilteredHandler(records);
            }
        })

    } 
    

    render() {
        
        return (
            
            <div className='show-history-wrapper'>
               {this.props.historyDataFiltered.length === 0 && 
                <h4 id="empty-list-message">No history Found</h4>}
                
                {this.props.historyDataFiltered.map((row, key) => {
                    
                    return (
                        <div key={row.key} className="quiz-item">
                            <div className="quiz-text-header" onClick={() => this.props.handleQuestionClick(key)}>
                                <div className='quiz-text-header-title'>
                                    {this.props.expandedId === key && <AiOutlineUp/>}
                                    {this.props.expandedId !== key && <AiOutlineDown/>}
                                    {key + 1}.  {row.data.quizTitle}
                                </div> 

                                <div className='quiz-text-header-timestamp'>{row.data.timestamp}</div>    
                                    
                            </div>
                            
                            {this.props.expandedId === key && (
                                
                                <div className="quiz-content">
                                    {this.props.historyType === "participant" && <ShowParticipantHistory questions={row.data.questions} quizId={row.key}/>}
                                    {this.props.historyType === "host" && <ShowHostHistory data={row.data} quizId={row.key}/>}
                                </div>
                            )}

                        </div>
                    )
                })}
                
            </div>
        )
    }  
}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        const [expandedId, setExpandedId] = useState(null);
        const [quizDataFiltered, setQuizDataFiltered] = useState([])
        const [quizData, setQuizData] = useState([])
        
        const handleQuestionClick = (id) => {
            if (expandedId === id) {
                setExpandedId(null);
            } else {
                setExpandedId(id);
            }
        };

        const setQuizDataFilteredHandler = (quizData) => {
            setQuizData(quizData)
        }

        useEffect(() => {
            const auxQuizData = quizData.filter((el) => {
                let auxTitle = el.data.quizTitle.toLowerCase();
                let timestamp = el.data.timestamp;

                
                if (props.search === "")
                    return el;

                if (auxTitle.includes(props.search.toLowerCase()) || timestamp.includes(props.search))
                    return el;
                
            })
            setQuizDataFiltered(auxQuizData)


        }, [quizData, props.search])


        return <Component historyType={props.historyType}
                          handleQuestionClick={handleQuestionClick}
                          expandedId={expandedId}
                          setQuizDataFilteredHandler={setQuizDataFilteredHandler}
                          historyDataFiltered={quizDataFiltered}
                          />
    }
}

export default wrapClass(ShowHistory);