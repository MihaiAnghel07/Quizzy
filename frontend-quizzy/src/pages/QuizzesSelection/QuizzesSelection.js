import './QuizzesSelection.css'
import React, { useEffect } from 'react'
import ShowQuizzes from '../../components/showQuizzes/ShowQuizzes';
import firebase from "firebase/app";
import ShowQuizzesSelection from '../../components/ShowQuizzesSelection/ShowQuizzesSelection';
import { useLocation } from 'react-router-dom';


class QuizzesSelection extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            myQuizzes: true,
            //username: firebase.auth().currentUser.displayName,
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
                    </div>
                
                    <div className='quizzes-body'>
                        <div className="show-public-quizzes">
                            {this.state.myQuizzes && <ShowQuizzesSelection 
                                                        quizzesType='private' 
                                                        path={this.state.username} 
                                                         />}
                            {!this.state.myQuizzes && <ShowQuizzesSelection 
                                                        quizzesType='public' 
                                                        path='' 
                                                        />}
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        let location = useLocation();
        
        // useEffect(()=>{
        //     location.state.quizAuthorSetter.quizAuthor = 'sad';
        //     console.log(location.state.quizAuthorSetter.quizAuthor);
        //   })
        // console.log(location.state.quizIdSetter)
        // console.log(location.state.quizAuthor)

        return <Component />
    }
}

export default wrapClass(QuizzesSelection); 