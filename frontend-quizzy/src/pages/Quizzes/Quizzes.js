import ShowQuizzes from '../../components/showQuizzes/ShowQuizzes';
import './Quizzes.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/modal/Modal';
import { useDeleteQuiz } from '../../hooks/useDeleteQuiz';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';
import { GrAdd } from 'react-icons/gr'



class Quizzes extends React.Component {
    constructor() {
        super();
        this.state = {
            quizzesData: [],
            myQuizzes: true,
            username: localStorage.getItem("username"),
            myQuizzesBtn: "quizzes-my-quizzes-btn2",
            allQuizzesBtn: "quizzes-all-quizzes-btn"
        }
        
        //this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    myQuizzesHandler = (e) => {
        e.preventDefault();
        this.state.myQuizzes = true;
        this.setState({myQuizzesBtn:"history-host-btn2", allQuizzesBtn: "quizzes-all-quizzes-btn"})

        this.forceUpdate();

    }

    allQuizzesHandler = (e) => {
        e.preventDefault();
        this.state.myQuizzes = false;
        this.setState({myQuizzesBtn:"history-host-btn", allQuizzesBtn: "quizzes-all-quizzes-btn2"})

        this.forceUpdate();

    }

   
    render () {
        return (
            <div className='quizzes-wrapper'>

                <div className='quizzes-navigation-component'>
                    <NavigationComponent
                        pageTitle="Question Sets"
                        pairs={[["Dashboard", "/dashboard"],
                                ["Question Sets", "/quizzes"]]}
                    />
                </div>

                <h2 className='quizzes-title'>Question Sets</h2>

                {this.props.openModal && <div className='modal-delete-quiz'> 
                    <Modal closeModal={this.props.setOpenModal} yesModal={this.props.setConfirmModal} message="Are you sure you want to delete the quiz?" /> </div>}   

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
                        <button id='quizzes-create-quizz-btn' onClick={this.props.createQuizHandler}><GrAdd />Create&nbsp;&nbsp; Question Set</button>
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