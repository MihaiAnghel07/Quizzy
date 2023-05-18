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
import Rating from '../../components/Rating/Rating';
import { useSaveStatistics } from '../../hooks/useSaveStatistics';



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
            userAnswers: [],
            quizData: [],
            duration: 0,
            timerIsReady: false
        }

        let root = document.querySelector(':root');
        root.style.setProperty('--flag-color', '#474747');
        root.style.setProperty('--flag-color2', '#ffa500');
        root.style.setProperty('--scale', '1');
        root.style.setProperty('--scale2', '1.4');
        
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleFinishButtonClick = this.handleFinishButtonClick.bind(this);
        this.handleAnswerButtonClick = this.handleAnswerButtonClick.bind(this);
    }
    
    componentDidMount() {
        let quizAuthor = null;
        let quizId = null;
     
        // const storedDuration = sessionStorage.getItem('quizDuration');
        // if (storedDuration) {
        //     this.setState({ duration: Number(storedDuration), isReady: true });
        // } else {
        //     const duration = snapshot.child('duration').val();
        //     this.setState({ duration: Number(duration), timerIsReady: true });
        //     sessionStorage.setItem('quizDuration', duration);
        // }

        const ref = projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode);
        ref.get().then((snapshot) => {
            quizId = snapshot.val().quizId;
            quizAuthor = snapshot.val().quizAuthor;

            const duration = snapshot.child('duration').val();
            this.setState({ duration: Number(duration), timerIsReady: true });

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

                }
                
            })
        });
    }


    handleAnswerButtonClick = (answerOption) => {


       let question = this.state.quizData[this.state.currentQuestionCount].question;
       let questionId = this.state.quizData[this.state.currentQuestionCount].questionId;
       let answer1 = this.state.quizData[this.state.currentQuestionCount].answerOptions[0];
       let answer2 = this.state.quizData[this.state.currentQuestionCount].answerOptions[1];
       let answer3 = this.state.quizData[this.state.currentQuestionCount].answerOptions[2];
       let answer4 = this.state.quizData[this.state.currentQuestionCount].answerOptions[3];
       let image = this.state.quizData[this.state.currentQuestionCount].url;
       let isFlagged = this.props.isFlagged;

        const nextQuestionCount = this.state.currentQuestionCount + 1
        if (nextQuestionCount < this.state.quizData.length) {
            this.state.currentQuestionCount = nextQuestionCount
        } else {
            this.state.quizOver = true
        }

        if (answerOption.isCorrect) {
            this.state.score += 1;
        }


        const { currentQuestionId, userAnswers,} = this.state;

        const updatedUserAnswers = userAnswers;
        updatedUserAnswers.push({answerOption});
        this.setState({ userAnswers: updatedUserAnswers });
        this.props.saveStatisticsHandler(answerOption, question, questionId, answer1, answer2, answer3, answer4, image, isFlagged);
        
        if (isFlagged)
            this.props.handleFlagClick(this.state.quizData[this.state.currentQuestionCount].questionId, isFlagged)
        

        this.forceUpdate();
    }

    handleFinishButtonClick() {
        const userId = 2023;
        const userAnswers = this.state.userAnswers;

        const userAnswersRef = firebase.database().ref('userAnswers').child(userId);
        userAnswersRef.update(userAnswers)
          .then(() => {
            console.log('User answers saved successfully');

          })
          .catch((error) => {
            console.error('Error saving user answers:', error);
          });
        console.log(this.state.quizOver)
      }


    render() {
        return (
            <div className='quiz'>
                {this.state.quizOver ? 
                    (
                    <div className='score-section'>
                        <h2>Quiz has ended!</h2>
                        <h3 id='score'>You scored {this.state.score} out of {this.state.quizData.length}</h3>
                        <div className='feedback-section'>
                            <h3>Leave feedback</h3>
                            <textarea id='feedback-text-area' rows="6" cols="40" maxLength="500"></textarea>
                        </div>
                        <div className='rating-section'>
                            <h3>Rate this quiz</h3>
                            <Rating setRatingHandler={this.props.setRatingHandler}/>
                        </div>
                        <button id='quiz-end-finish-button' onClick={this.handleFinishButtonClick}>Finish</button>
                    </div>
                    ) 
                    : 
                    (
                    <div className='quiz-section'>
                        <div className='timer-flag-section'>
                            <div className='flag-icon'>
                                <FaFontAwesomeFlag className='flag-button' title='Flag this question' onClick={() => this.props.handleFlagClick(this.state.quizData[this.state.currentQuestionCount].questionId, this.props.isFlagged)}/>
                            </div>
                            <div className='timer-content'>
                                {this.state.timerIsReady && <Timer seconds={this.state.duration * 60} onTimerComplete={handleTimerComplete}/>}
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
                                <button key={key} onClick={() => this.handleAnswerButtonClick(answerOption)}>{answerOption.text}</button>)}
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
        const [rating, setRating] = useState(0);
        const [isFlagged, setIsFlagged] = useState(false);
        let {saveStatistics} = useSaveStatistics(); 

        const handleFlagClick = (questionId, isFlagged) => {
            //setFlag(location.state.lobbyCode, questionId);
            let root = document.querySelector(':root');
            let color = root.style.getPropertyValue('--flag-color')
            let color2 = root.style.getPropertyValue('--flag-color2')
            root.style.setProperty('--flag-color', color2);
            root.style.setProperty('--flag-color2', color);

            let scale = root.style.getPropertyValue('--scale')
            let scale2 = root.style.getPropertyValue('--scale2')
            root.style.setProperty('--scale', scale2);
            root.style.setProperty('--scale2', scale);
            setIsFlagged(!isFlagged);
        }

        const setRatingHandler = (rating) => {
            setRating(rating);
        }

        const saveStatisticsHandler = (answerOption, question, questionId, answer1, answer2, answer3, answer4, image, isFlagged) => {
            saveStatistics(location.state.lobbyCode, answerOption, question, questionId, answer1, answer2, answer3, answer4, image, isFlagged);
        }

    
        return <Component lobbyCode={location.state.lobbyCode} 
                        handleFlagClick={handleFlagClick} 
                        setRatingHandler={setRatingHandler} 
                        saveStatisticsHandler={saveStatisticsHandler}
                        isFlagged={isFlagged}/>
    }
}

export default wrapClass(Quiz); 
