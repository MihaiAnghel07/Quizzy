import ShowQuizzes from '../../components/showQuizzes/ShowQuizzes';
import './Quizzes.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/modal/Modal';
import { useDeleteQuiz } from '../../hooks/useDeleteQuiz';


class Quizzes extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            myQuizzes: true,
            username: localStorage.getItem("username")
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
                
                {this.props.openModal && <div> 
                    <Modal closeModal={this.props.setOpenModal} yesModal={this.props.setConfirmModal} message="Are you sure you want to delete the quiz?" /> </div>}   

                <div className='quizzes-content'>
                    <div className='quizzes-header'>
                        <button id='quizzes-my-quizzes-btn'
                                onClick={this.myQuizzesHandler}>My Quizzes</button>
                        <button id='quizzes-all-quizzes-btn'
                                onClick={this.allQuizzesHandler}>All Quizzes</button>
                        <input id="search-input"
                            placeholder='Search'
                            onChange={(e) => this.props.searchInputHandler(e.target.value)} 
                            />
                        <button id='quizzes-create-quizz-btn' onClick={this.props.createQuizHandler}>Create a Quiz</button>
                    </div>
                
                    <div className='quizzes-body'>
                        <div className="show-public-quizzes">
                            {this.state.myQuizzes && <ShowQuizzes quizzesType='private' path={this.state.username} openModalHandler={this.props.openModalHandler} search={this.props.searchInput}/>}
                            {!this.state.myQuizzes && <ShowQuizzes quizzesType='public' path='' openModalHandler={this.props.openModalHandler} search={this.props.searchInput}/>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        const [openModal, setOpenModal] = useState(false)
        const [confirmModal, setConfirmModal] = useState(false);
        const [quizId, setQuizId] = useState(null)
        const [quizAuthor, setQuizAuthor] = useState(null)
        const [searchInput, setSearchInput] = useState("");
        const { deleteQuiz} = useDeleteQuiz();
        let navigate = useNavigate();

        const deleteHandler = (quizId, quizAuthor) => {
            deleteQuiz(quizId, quizAuthor);
        }

        useEffect(()=>{
            if (confirmModal) {
              setConfirmModal(false)
              setOpenModal(false)
              deleteHandler(quizId, quizAuthor)
            }
        
          }, [confirmModal])  

        const openModalHandler = (quizId, quizAuthor)=> {
            setQuizId(quizId)
            setQuizAuthor(quizAuthor)
            setOpenModal(true)
        }

        const createQuizHandler = () => {
            navigate('/create_quiz');
        }

        const searchInputHandler = (input) => {
            setSearchInput(input)
        }

    
        return <Component setOpenModal={setOpenModal}
                          setConfirmModal={setConfirmModal}
                          openModal={openModal}
                          setQuizId={setQuizId}
                          setQuizAuthor={setQuizAuthor}
                          openModalHandler={openModalHandler}
                          createQuizHandler={createQuizHandler}
                          searchInputHandler={searchInputHandler}
                          searchInput={searchInput}/>
    }
}

export default wrapClass(Quizzes); 