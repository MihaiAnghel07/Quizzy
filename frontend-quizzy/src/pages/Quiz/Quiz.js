import './Quiz.css'
import firebase from "firebase/app";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react'
import Timer from '../../components/Timer/Timer';
import { FaFontAwesomeFlag, FaClock} from 'react-icons/fa'
import { projectFirebaseRealtime, projectFirebaseStorage } from '../../firebase/config'
import { useSetFlag } from '../../hooks/useSetFlag';



function handleTimerComplete() {
    alert('Time is up!');
  }

class Quiz extends React.Component {
    constructor() {
        super();
        this.state = {
            quizOver: false,
            score: 0,
            currentQuestionCount: 0,
            currentQuestionId: 0,
            quizData: [
                // {
                //     question: 'Question 1',
                //     answerOptions: [
                //         {text: 'This is a very long answer for the purpose of testing the answer button scaling', isCorrect: true},
                //         {text: 'Answer 2', isCorrect: false},
                //         {text: 'Answer 3', isCorrect: false},
                //         {text: 'This is an even longer answer for the purpose of testing if the text will go on the next line after a certain length has been reached, and it seems to work ok, might need some tweaking later idk.', isCorrect: false},
                //     ],
                //     hasImage: false
                // },
                // {
                //     question: 'Question 2',
                //     answerOptions: [
                //         {text: 'Answer 5', isCorrect: true},
                //         {text: 'Answer 6', isCorrect: false},
                //         {text: 'Answer 7', isCorrect: false},
                //         {text: 'Answer 8', isCorrect: false},
                //     ],
                //     hasImage: false
                // },
                // {
                //     question: 'Question 3',
                //     answerOptions: [
                //         {text: 'Answer 9', isCorrect: true},
                //         {text: 'Answer 10', isCorrect: false},
                //         {text: 'Answer 11', isCorrect: false},
                //         {text: 'Answer 12', isCorrect: false},
                //     ],
                //     hasImage: false
                // }
            ]
        }

        let root = document.querySelector(':root');
        root.style.setProperty('--flag-color', '#474747');
        root.style.setProperty('--flag-color2', '#ffa500');
        root.style.setProperty('--scale', '1');
        root.style.setProperty('--scale2', '1.4');
        
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    
    componentDidMount() {
        let quizAuthor = null;
        let quizId = null;
     
        const ref = projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode);
        ref.get().then((snapshot) => {
            quizId = snapshot.val().quizId;
            quizAuthor = snapshot.val().quizAuthor;
            
            const ref2 = projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizId + '/Questions');
            ref2.once('value', (snapshot2) => {
                if (snapshot2.exists()) {
                    let records = [];
                    let answerOptions = [];
                    let promises = [];

                    snapshot2.forEach( (childSnapshot) => {
                       
                        let questionId = childSnapshot.key; 
                        let question = childSnapshot.val().question;
                        let hasImage = childSnapshot.val().hasImage;
                        let answer1 = childSnapshot.val().answer1;
                        let answer2 = childSnapshot.val().answer2;
                        let answer3 = childSnapshot.val().answer3;
                        let answer4 = childSnapshot.val().answer4;
                        let isFlagged = childSnapshot.val().isFlagged;
                        
                        answerOptions.push(answer1)
                        answerOptions.push(answer2)
                        answerOptions.push(answer3)
                        answerOptions.push(answer4)

                        //records.push({'question': question, 'answerOptions':answerOptions, 'hasImage':hasImage})
                        if (hasImage) {
                            const image = projectFirebaseStorage.ref('Images/' + quizAuthor + '/' + quizId + '/Questions/' + childSnapshot.key + '/' + childSnapshot.val().image);
                            let promise = image.getDownloadURL().then((url) => {
                                let answerOptions2 = []
                                answerOptions2.push(answer1)
                                answerOptions2.push(answer2)
                                answerOptions2.push(answer3)
                                answerOptions2.push(answer4)
                                records.push({'questionId':questionId, 'question': question, 'answerOptions':answerOptions2, 'hasImage':hasImage, 'url': url, 'isFlagged':isFlagged})
                                
                            })
                            promises.push(promise)
                        
                        } else {
                            records.push({'questionId':questionId, 'question': question, 'answerOptions':answerOptions, 'hasImage': hasImage, 'isFlagged': isFlagged})
                        }
                        
                        answerOptions = [];
                        
                    })

                    Promise.all(promises).then(() => {
                        this.setState({quizData: records});
                    
                    });
                    //this.setState({quizData: records});
                    
                    // de mapat datele
                    // CE FA CEM CU TESTELE PUBLICE CARE SE MOFIFICA IN TIMOUL NQUIZULUI?
                }
                
            })
        });
        
    }

    handleAnswerButtonClick = (isCorrect) => {
       // e.preventDefault();
        
        const nextQuestionCount = this.state.currentQuestionCount + 1
        if (nextQuestionCount < this.state.quizData.length) {
            this.state.currentQuestionCount = nextQuestionCount
        } else {
            this.state.quizOver = true
        }

        if (isCorrect) {
            this.state.score += 1;
        }
        

        this.forceUpdate();
    }


    render() {
        return (
            <div className='quiz'>
                {this.state.quizOver ? (<div className='score-section'>You scored {this.state.score} out of {this.state.quizData.length}</div>) : (
                    <div className='quiz-section'>
                        <div className='timer-flag-section'>
                            <div className='flag-icon'>
                                <FaFontAwesomeFlag className='flag-button' title='Flag this question' onClick={() => this.props.handleFlagClick(this.state.quizData[this.state.currentQuestionCount].questionId)}/>
                            </div>
                            <div className='timer-content'>
                                <Timer seconds={3600} onTimerComplete={handleTimerComplete}/>
                                <FaClock/>
                            </div>
                        </div>
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>Question {this.state.currentQuestionCount + 1}</span>/{this.state.quizData.length}
                            </div>

                            {this.state.quizData.length !== 0 && <div className='question-text'>{this.state.quizData[this.state.currentQuestionCount].question}</div>}
                            {this.state.quizData.length !== 0 && this.state.quizData[this.state.currentQuestionCount].hasImage &&
                            <img src={this.state.quizData[this.state.currentQuestionCount].url} width='700' height='400'/>}
                        
                        </div>
                        {this.state.quizData.length !== 0 && <div className='answer-section'>
                            {this.state.quizData[this.state.currentQuestionCount].answerOptions.map((answerOption, key) => 
                                <button key={key} onClick={() => this.handleAnswerButtonClick(answerOption.isCorrect)}>{answerOption.text}</button>)}
                        </div>}
                    </div> 
                )}
            </div>
             
        )
    }
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        const { setFlag } = useSetFlag();

        const handleFlagClick = (questionId) => {
            setFlag(location.state.lobbyCode, questionId);
            let root = document.querySelector(':root');
            let color = root.style.getPropertyValue('--flag-color')
            let color2 = root.style.getPropertyValue('--flag-color2')
            root.style.setProperty('--flag-color', color2);
            root.style.setProperty('--flag-color2', color);

            let scale = root.style.getPropertyValue('--scale')
            let scale2 = root.style.getPropertyValue('--scale2')
            root.style.setProperty('--scale', scale2);
            root.style.setProperty('--scale2', scale);

        }

    
        return <Component lobbyCode={location.state.lobbyCode} handleFlagClick={handleFlagClick} />
    }
}

export default wrapClass(Quiz); 
