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
import { useSaveRatingAndFeedback } from '../../hooks/useSaveRatingAndFeedback';
import Modal from '../../components/modal/Modal';



class Quiz extends React.Component {
    constructor(props) {
        super(props);
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
        this.handleTimerComplete = this.handleTimerComplete.bind(this);
        this.returnTimeHandler = this.returnTimeHandler.bind(this);
    }


    componentDidMount() {
        let quizAuthor = null;
        let quizId = null;

        sessionStorage.setItem("quizOnGoing", true);

        // in caz de refresh, trebuie sa revenim la intrabarea la care eram inainte
        if (this.props.currentQuestionCount != null) {
            this.state.currentQuestionCount = parseInt(this.props.currentQuestionCount);
        }             
          
        const ref = projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode);
        ref.get().then((snapshot) => {
            quizId = snapshot.val().quizId;
            quizAuthor = snapshot.val().quizAuthor;
            console.log(snapshot.val())
            let duration;
            if (localStorage.getItem("quizDuration") == null) {
                duration = snapshot.child('duration').val() * 60;
                localStorage.setItem("quizDuration", duration);
            
            } else {
                // -1 sec pentru delay-ul refresh-ului
                duration = localStorage.getItem("quizDuration") - 1;
            }


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
                                records.push({'questionId':questionId, 'question': question, 'answerOptions':answerOptions2, 'hasImage':hasImage, 'image':childSnapshot.val().image, 'url': url, 'isFlagged':isFlagged})
                                
                            })
                            promises.push(promise)
                        
                        } else {
                            records.push({'questionId':questionId, 'question': question, 'answerOptions':answerOptions, 'hasImage': hasImage, 'image':childSnapshot.val().image, 'isFlagged': isFlagged})
                        }
                        
                        answerOptions = [];
                        
                    })

                    Promise.all(promises).then(() => {
                        // daca vreau ca intrebarile sa fie in ordine, decomentez linia asta
                        // console.log(records)
                        records.sort((a,b) => (a.questionId > b.questionId) ? 1 : ((b.questionId > a.questionId) ? -1 : 0))
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
       let hasImage = this.state.quizData[this.state.currentQuestionCount].hasImage;
       let image = hasImage ? this.state.quizData[this.state.currentQuestionCount].image : null;
       let isFlagged = this.props.isFlagged;

        const nextQuestionCount = this.state.currentQuestionCount + 1
        if (nextQuestionCount < this.state.quizData.length) {
            this.state.currentQuestionCount = nextQuestionCount
            this.props.setQuestionIndexHandler(nextQuestionCount);

        } else {
            this.state.quizOver = true
            localStorage.removeItem("currentQuestionCount");
            localStorage.removeItem("quizDuration");
            sessionStorage.removeItem("quizOnGoing");
            localStorage.removeItem("alertTime");
        }

        if (answerOption.isCorrect) {
            this.state.score += 1;
        }


        const {userAnswers} = this.state;
        const updatedUserAnswers = userAnswers;
        updatedUserAnswers.push({answerOption});
        this.setState({ userAnswers: updatedUserAnswers });
        this.props.saveStatisticsHandler(answerOption, question, questionId, answer1, answer2, answer3, answer4, hasImage, image, isFlagged);
        
        if (isFlagged)
            this.props.handleFlagClick(this.state.quizData[this.state.currentQuestionCount].questionId, isFlagged)
        

        this.forceUpdate();
    }

    handleFinishButtonClick() {
        localStorage.removeItem("quizDuration");
        localStorage.removeItem("currentQuestionCount");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        this.props.saveRatingAndFeedbackHandler(this.props.rating, this.props.feedback);
    }

    handleTimerComplete() {
        this.state.quizOver = true;
        localStorage.removeItem("quizDuration");
        localStorage.removeItem("currentQuestionCount");
        sessionStorage.removeItem("quizOnGoing");
        localStorage.removeItem("alertTime");
        
        this.forceUpdate();
    }

    returnTimeHandler(timeLeft) {
        localStorage.setItem("quizDuration", timeLeft);
        if (this.state.quizOver) {
            localStorage.removeItem("quizDuration");
            localStorage.removeItem("currentQuestionCount");
            sessionStorage.removeItem("quizOnGoing");
            localStorage.removeItem("alertTime");
        }
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
                            <textarea id='feedback-text-area' rows="6" cols="40" maxLength="500" onChange={(e) => this.props.setFeedback(e.target.value)}></textarea>
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
                                {this.state.timerIsReady && <Timer seconds={this.state.duration} onTimerComplete={this.handleTimerComplete} returnTimeHandler={this.returnTimeHandler}/>}
                                <FaClock/>
                            </div>
                        </div>
                        <div className='question-section'>
                            <div className='question-count'>
                                <span>Question {this.state.currentQuestionCount + 1}</span>/{this.state.quizData.length}
                            </div>

                            {this.state.quizData.length !== 0 && <div className='question-text'>{this.state.quizData[this.state.currentQuestionCount].question}</div>}
                            {this.state.quizData.length !== 0 && this.state.quizData[this.state.currentQuestionCount].hasImage &&
                            <img src={this.state.quizData[this.state.currentQuestionCount].url} width='50%' height='10%'/>}
                        
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
        const [rating, setRating] = useState(0);
        const [isFlagged, setIsFlagged] = useState(false);
        const [feedback, setFeedback] = useState("");
        const [quizId, setQuizId] = useState(null);
        const [host, setHost] = useState(null);
        const { saveRatingAndFeedback } = useSaveRatingAndFeedback();
        let {saveStatistics} = useSaveStatistics(); 
        let navigate = useNavigate();
    

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

        const saveStatisticsHandler = (answerOption, question, questionId, answer1, answer2, answer3, answer4, hasImage, image, isFlagged) => {
            if (quizId === null) {
                setQuizIdAndHostFunc();
            }
            saveStatistics(location.state.lobbyCode, answerOption, question, questionId, answer1, answer2, answer3, answer4, hasImage, image, isFlagged);
        }

        const setQuizIdAndHostFunc = async () => {
            const ref = projectFirebaseRealtime.ref("Lobbies/" + location.state.lobbyCode);
            await ref.once("value", (snapshot) => {
                if (snapshot.exists()) {
                    setQuizId(snapshot.val().lobbyId);
                    setHost(snapshot.val().host);
                }
            })

        }

        const saveRatingAndFeedbackHandler = (rating, feedback) => {
            saveRatingAndFeedback(host, quizId, rating, feedback);
            navigate('/dashboard', {replace:true});
        }

        const setQuestionIndexHandler = (index) => {
            localStorage.setItem("currentQuestionCount", index);
        }

    
        
        function handlePopState(event) {
            let startTime = new Date().getTime();

            // Display a confirmation dialog to ask the user if they want to leave
            let leavePage = window.confirm('Are you sure you want to leave this page?');
            console.log(leavePage)

            if (!leavePage) {
                // If the user chooses to stay, prevent the default behavior of the popstate event
                window.history.pushState(null, document.title, location.href);
                event.preventDefault();
                const duration = Math.round((new Date().getTime() - startTime) / 1000);
                console.log(`Confirmation dialog lasted for ${duration} seconds.`);
                localStorage.setItem(
                    "alertTime",
                    parseInt(localStorage.getItem("alertTime") == null ? 0 : localStorage.getItem("alertTime")) + duration
                );

            } else {
                localStorage.removeItem("currentQuestionCount");
                // localStorage.removeItem("quizDuration");
                sessionStorage.removeItem("quizOnGoing");
                localStorage.removeItem("alertTime");
                // navigate('/dashboard', {replace:true})
            }

            // Unbind the event listener after it has been triggered
            //window.removeEventListener('popstate', handlePopState);
        };

        //window.addEventListener('popstate', handlePopState);
        
        useEffect(() => {
            window.addEventListener('popstate', handlePopState);
      
            return () => {
              window.removeEventListener('popstate', handlePopState);
            };
        }, []);
    
        return <Component lobbyCode={location.state.lobbyCode} 
                        handleFlagClick={handleFlagClick} 
                        setRatingHandler={setRatingHandler} 
                        saveStatisticsHandler={saveStatisticsHandler}
                        isFlagged={isFlagged}
                        rating={rating}
                        setFeedback={setFeedback}
                        feedback={feedback}
                        saveRatingAndFeedbackHandler={saveRatingAndFeedbackHandler}
                        setQuestionIndexHandler={setQuestionIndexHandler}
                        currentQuestionCount={localStorage.getItem("currentQuestionCount")}
                        />
    }
}

export default wrapClass(Quiz); 
