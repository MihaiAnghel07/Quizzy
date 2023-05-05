import ShowQuizzes from '../../components/showQuizzes/ShowQuizzes';
import './Quizzes.css'
import firebase from "firebase/app";
import React from 'react'
import { Link, useLocation } from 'react-router-dom';


export default class Quizzes extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            myQuizzes: true,
            username: sessionStorage.getItem("username")
        }
        
        //this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    myQuizzesHandler = (e) => {
        e.preventDefault();
        this.state.myQuizzes = true;
        let root = document.querySelector(':root');
        root.style.setProperty('--btn-background-color', '#ffe4c4');
        root.style.setProperty('--btn-hover-background-color', '#fad5a7');

        this.forceUpdate();

    }

    allQuizzesHandler = (e) => {
        e.preventDefault();
        this.state.myQuizzes = false;
        let root = document.querySelector(':root');
        root.style.setProperty('--btn-background-color', '#fad5a7');
        root.style.setProperty('--btn-hover-background-color', '#ffe4c4');
        this.forceUpdate();

    }

   
    render () {
        return (
            <div className='quizzes-wrapper'>
                <div className='quizzes-content'>
                    <div className='quizzes-header'>
                        <button id='quizzes-my-quizzes-btn'
                                onClick={this.myQuizzesHandler}>My Quizzes</button>
                        <button id='quizzes-all-quizzes-btn'
                                onClick={this.allQuizzesHandler}>All Quizzes</button>
                        <button id='quizzes-create-quizz-btn'
                                ><Link to='/create_quiz' 
                                       id='quizzes-create-quizz-link'>Create a Quiz</Link></button>
                    </div>
                
                    <div className='quizzes-body'>
                        <div className="show-public-quizzes">
                            {this.state.myQuizzes && <ShowQuizzes quizzesType='private' path={this.state.username} />}
                            {!this.state.myQuizzes && <ShowQuizzes quizzesType='public' path='' />}
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}