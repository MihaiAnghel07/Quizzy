import './QuizzesSelection.css'
import React, { useEffect, useState } from 'react'
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
                        <input id="search-input"
                            placeholder='Search'
                            onChange={(e) => this.props.searchInputHandler(e.target.value)} 
                        />
                        <div className='quiz-filter-buttons'>
                            <h3 id='filter-h3'>Filter:</h3>
                            <button id='quizzes-my-quizzes-btn'
                                    onClick={this.myQuizzesHandler}>My Question Sets</button>
                            <button id='quizzes-all-quizzes-btn'
                                    onClick={this.allQuizzesHandler}>All Question Sets</button>
                        </div>
                    </div>
                
                    <div className='quizzes-body'>
                        <div className="show-public-quizzes">
                            {this.state.myQuizzes && <ShowQuizzesSelection 
                                                        quizzesType='private' 
                                                        path={this.state.username} 
                                                        search={this.props.searchInput}
                                                         />}
                            {!this.state.myQuizzes && <ShowQuizzesSelection 
                                                        quizzesType='public' 
                                                        path=''
                                                        search={this.props.searchInput}
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
        const [searchInput, setSearchInput] = useState("");


        const searchInputHandler = (input) => {
            setSearchInput(input)
        }

        return <Component searchInputHandler={searchInputHandler}
                          searchInput={searchInput}/>
    }
}

export default wrapClass(QuizzesSelection); 