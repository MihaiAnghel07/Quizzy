import './QuizzesSelection.css'
import React, { useEffect, useState } from 'react'
import ShowQuizzes from '../../components/showQuizzes/ShowQuizzes';
import firebase from "firebase/app";
import ShowQuizzesSelection from '../../components/ShowQuizzesSelection/ShowQuizzesSelection';
import { useLocation } from 'react-router-dom';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';


class QuizzesSelection extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            myQuizzes: true,
            myQuizzesBtn: "quizzes-my-quizzes-btn2",
            allQuizzesBtn: "quizzes-all-quizzes-btn"
        }
       
        //this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    myQuizzesHandler = (e) => {
        e.preventDefault();
        this.state.myQuizzes = true;
        this.setState({myQuizzesBtn:"quizzes-my-quizzes-btn2", allQuizzesBtn: "quizzes-all-quizzes-btn"})

        this.forceUpdate();

    }

    allQuizzesHandler = (e) => {
        e.preventDefault();
        this.state.myQuizzes = false;
        this.setState({myQuizzesBtn:"quizzes-my-quizzes-btn", allQuizzesBtn: "quizzes-all-quizzes-btn2"})

        this.forceUpdate();

    }

   
    render () {
        return (
            <div className='quizzes-wrapper'>

                <div className='quizzes-navigation-component'>
                    <NavigationComponent
                        pageTitle="Quizzes Selection"
                        pairs={[['Dashboard', '/dashboard'],
                                ['Create Lobby', '/create_lobby'],
                                ['Quizzes Selection', '/quizzes_selection']
                        ]}
                    />
                </div>

                <div className='quizzes-content'>
                    <div className='quizzes-header'>
                        <input id="search-input"
                            placeholder='Search'
                            onChange={(e) => this.props.searchInputHandler(e.target.value)} 
                        />
                        <div className='quiz-filter-buttons'>
                            <h3 id='filter-h3'>Filter:</h3>
                            <button id={this.state.myQuizzesBtn}
                                    onClick={this.myQuizzesHandler}>My Question Sets</button>
                            <button id={this.state.allQuizzesBtn}
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