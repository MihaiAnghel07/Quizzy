import './Quiz.css'
import firebase from "firebase/app";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React from 'react'
import Timer from '../../components/Timer/Timer';
import { FaFontAwesomeFlag, FaClock} from 'react-icons/fa'



function handleTimerComplete() {
    alert('Time is up!');
  }

export default class Quiz extends React.Component {
    constructor() {
        super();
        this.state = {
            // username: firebase.auth().currentUser.displayName,
            quizOver: false,
            score: 0,
            currentQuestionCount: 0,
            quizData: [
                {
                    questionText: 'Question 1',
                    answerOptions: [
                        {answerText: 'This is a very long answer for the purpose of testing the answer button scaling', isCorrect: true},
                        {answerText: 'Answer 2', isCorrect: false},
                        {answerText: 'Answer 3', isCorrect: false},
                        {answerText: 'This is an even longer answer for the purpose of testing if the text will go on the next line after a certain length has been reached, and it seems to work ok, might need some tweaking later idk.', isCorrect: false},
                    ],
                    hasImage: false
                },
                {
                    questionText: 'Question 2',
                    answerOptions: [
                        {answerText: 'Answer 5', isCorrect: true},
                        {answerText: 'Answer 6', isCorrect: false},
                        {answerText: 'Answer 7', isCorrect: false},
                        {answerText: 'Answer 8', isCorrect: false},
                    ],
                    hasImage: false
                },
                {
                    questionText: 'Question 3',
                    answerOptions: [
                        {answerText: 'Answer 9', isCorrect: true},
                        {answerText: 'Answer 10', isCorrect: false},
                        {answerText: 'Answer 11', isCorrect: false},
                        {answerText: 'Answer 12', isCorrect: false},
                    ],
                    hasImage: false
                }
            ]
        }
       // this.componentDidMount = this.componentDidMount.bind(this)
    }

    // componentDidMount() {

    // }

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

    handleFlagClick = () => {
        // Handle event for when user clicks the flag button
        alert('Flagged')
    }




    render() {
        return (
            <div className='quiz'>
                {this.state.quizOver ? (<div className='score-section'>You scored {this.state.score} out of {this.state.quizData.length}</div>) : (
                    <div className='quiz-section'>
                        <div className='timer-flag-section'>
                            <div className='flag-icon'>
                                <FaFontAwesomeFlag className='flag-button' title='Flag this question' onClick={this.handleFlagClick}/>
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
                            <div className='question-text'>{this.state.quizData[this.state.currentQuestionCount].questionText}</div>
                        </div>
                        <div className='answer-section'>
                            {this.state.quizData[this.state.currentQuestionCount].answerOptions.map((answerOption) => <button onClick={() => this.handleAnswerButtonClick(answerOption.isCorrect)}>{answerOption.answerText}</button>)}
                        </div>
                    </div> 
                )}
            </div>
             
        )
    }
}
