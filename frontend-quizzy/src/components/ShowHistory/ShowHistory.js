import React from 'react'
import './ShowHistory.css'
import { projectFirebaseRealtime } from '../../firebase/config'
import { Table } from 'react-bootstrap';
import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import ShowQuiz from '../ShowQuiz/ShowQuiz';


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
                // console.log(records)
            }
        })
    } 
    

    render() {
        
        return (
            
            <div id='show-history-wrapper'>
               {this.state.historyData.length === 0 && 
                <h4 id="empty-list-message">No history Found</h4>}
                
                {this.state.historyData.map((row, key) => {
                    return (
                        <div key={row.key} className="quiz-item">
                            {/* {Object.keys(row.data).filter((item) => item !== "quizTitle" && item !== "timestamp")} */}
                        
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
                                    {this.props.historyType === "participant" && <ShowQuiz questions={row.data.questions}
                                                                                            quizId={row.key}/>}
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

        const handleQuestionClick = (id) => {
            if (expandedId === id) {
                setExpandedId(null);
            } else {
                setExpandedId(id);
            }
        };

        return <Component historyType={props.historyType}
                          handleQuestionClick={handleQuestionClick}
                          expandedId={expandedId}/>
    }
}

export default wrapClass(ShowHistory);