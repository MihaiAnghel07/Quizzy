
import React from 'react'
import './UpdateQuiz.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { projectFirebaseRealtime } from '../../firebase/config'
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai'
import QuestionEdit from '../../components/QuestionEdit/QuestionEdit';
import { useUpdateQuiz } from '../../hooks/useUpdateQuiz';


class UpdateQuiz extends React.Component {

    constructor() {
        super();
        this.state = {
            quizTitle: null,
            quizQuestions: [],
            isPublic: false
        }
       
       this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        let quizAuthor = this.props.quizAuthor;
        let quizId = this.props.quizId;
        const ref = projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizId);
        ref.on('value', (snapshot) => {
            let quizTitle = snapshot.val().Title;
            let isPublic = snapshot.val().isPublic;
            let record = []
            const ref2= projectFirebaseRealtime.ref('Quizzes/' + quizAuthor + '/' + quizId + '/Questions');

            ref2.once('value', (childSnapshot) => {
                childSnapshot.forEach((questionSnapshot) => {
                    //console.log(questionSnapshot.key)
                    record.push({'key':questionSnapshot.key, 'data':questionSnapshot.val()})
                })
            })
            console.log(record)
            this.setState({quizTitle:quizTitle, quizQuestions:record, isPublic:isPublic});
            
        }) 
    }


    render() {
        return (
            <div className='update-quiz-wrapper'>
                {this.state.quizTitle !== null &&
                <div className='update-quiz-content'>
                    <div className='quiz-metadata'>

                        <input 
                            id='quiz-title-metadata'
                            value={this.props.quizTitle}
                            onChange={(e)=>this.props.setQuizTitle(e.target.value)}
                            />
                        
                        <div className="dropdown">
                            <button className="dropdown-toggle" onClick={this.props.toggleDropdown}>
                                Visibility: {this.props.isPublic? 'Public': 'Private'}
                            </button>
                            {this.props.isOpen && (
                                <div className="dropdown-menu">
                                {this.props.options.map((option) => (
                                    <div
                                    key={option.value}
                                    className="dropdown-item"
                                    onClick={() => this.props.handleOptionClick(option)}
                                    >
                                    {option.label}
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <button onClick={this.props.handleSave}>Save</button>
                        </div>
                        
                        <div>
                            <button onClick={this.props.handleAddQuestion}>Add question</button>
                        </div>

                        {this.state.quizQuestions.map((question, key) => {
                            return (
                                <div key={key} className="question-container">
                                    <div className="question-text-header" onClick={() => this.props.handleQuestionClick(key)}>
                                    {this.props.expandedId === key && <AiOutlineUp/>}
                                    {this.props.expandedId != key && <AiOutlineDown/>}
                                        {question.data.question}
                                    </div>
                                    
                                    {this.props.expandedId === key && (
                                    <div className="question-form">
                                        <QuestionEdit quizQuestion={question.data.question}
                                                      quizAnswer1={question.data.answer1}
                                                      quizAnswer2={question.data.answer2}
                                                      quizAnswer3={question.data.answer3}
                                                      quizAnswer4={question.data.answer4}
                                                      questionKey={question.key}
                                                      quizKey={this.props.quizId}
                                                      quizAuthor={this.props.quizAuthor}
                                                     />
                                    </div>
                                    )}
                                </div>
                            )
                        })}
            

                    </div>
                </div>}
            </div>
        )
    }
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        const navigate = useNavigate();
        const [quizTitle, setQuizTitle] = useState(location.state.quizTitle);
        const [isOpen, setIsOpen] = useState(false);
        const [selectedOption, setSelectedOption] = useState('');
        const [isPublic, setIsPublic] = useState(location.state.isPublic);
        const [expandedId, setExpandedId] = useState(null);
        const {updateQuiz} = useUpdateQuiz();
        
        const options = [
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
        ];

        const handleQuestionClick = (id) => {
            if (expandedId === id) {
                setExpandedId(null);
            } else {
                setExpandedId(id);
            }
        };

        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        const handleOptionClick = (option) => {
            setSelectedOption(option);
            setIsOpen(false);
            setIsPublic(option.value === 'public' ? true : false)
        };

        const handleSave = () => {
            if (quizTitle !== null && quizTitle.length > 0)
                updateQuiz(location.state.quizAuthor, location.state.quizId, quizTitle, isPublic);
            else
                alert("Quiz title cannot be empty!")
        }
        
        const handleAddQuestion = () => {
            console.log(location.state.quizId)
            navigate('/add_question', {state:{quizKey:location.state.quizId, quizAuthor:location.state.quizAuthor, previousPage:'/update_quiz'}})
        }

        return <Component setQuizTitle={setQuizTitle}
                          isOpen={isOpen}
                          toggleDropdown={toggleDropdown}
                          handleOptionClick={handleOptionClick}
                          options={options}
                          selectedOption={selectedOption}
                          quizId={location.state.quizId}
                          quizAuthor={location.state.quizAuthor}
                          isPublic={isPublic}
                          handleQuestionClick={handleQuestionClick}
                          expandedId={expandedId}
                          handleSave={handleSave}
                          quizTitle={quizTitle}
                          handleAddQuestion={handleAddQuestion} />
    }
}

export default wrapClass(UpdateQuiz); 