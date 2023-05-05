import { React, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAddQuestion } from '../../hooks/useAddQuestion';
import './AddQuestion.css'
import Modal from '../../components/modal/Modal'

export const AddQuestion = () => {

    const [quizQuestion, setQuizQuestion] = useState('')
    const [quizAnswer1, setQuizAnswer1] = useState('')
    const [quizAnswer2, setQuizAnswer2] = useState('')
    const [quizAnswer3, setQuizAnswer3] = useState('')
    const [quizAnswer4, setQuizAnswer4] = useState('')
    const { addQuestion } = useAddQuestion();
    const [selectedOption, setSelectedOption] = useState('answer1');
    const [imageUpload, setImageUpload] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    let navigate = useNavigate();
    let location = useLocation();


    const handleSubmit = (e) => {
        e.preventDefault()
        addQuestion(quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, location.state.quizKey);
    }

    // when confirmModal modified, cloase the lobby and redirect to dashboard
    useEffect(()=>{
        if (confirmModal) {
          navigate('/quizzes', {replace: true});
        }
    }, [confirmModal])

    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }

    return (
      <div id="add-question-form-wrap">
        
        {openModal && <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you done adding questions? Make sure you added the current question!" />}
        
        <h2>Add A New Question</h2>
        <form id="add-question-form" onSubmit={handleSubmit}>
          <p>
          <input 
            type="quizQuestion" 
            id="quizQuestion-add-question" 
            name="quizQuestion" 
            placeholder="Quiz Question" 
            onChange={(e) => setQuizQuestion(e.target.value)} 
            required />
            <i className="validation"></i>
          </p>
          <input 
            type='file' 
            id='upload-image-btn'
            onChange={(event) => {setImageUpload(event.target.files)}}>
            </input>
          <p>
          <input 
            type="quizAnswer1" 
            id="quizAnswer1-add-question" 
            name="quizAnswer1" 
            placeholder="Answer 1" 
            onChange={(e) => setQuizAnswer1(e.target.value)} 
            required />
            <i className="validation"></i>
          </p>
          <p>
          <input 
            type="quizAnswer2" 
            id="quizAnswer2-add-question" 
            name="quizAnswer2" 
            placeholder="Answer 2" 
            onChange={(e) => setQuizAnswer2(e.target.value)} 
            required />
            <i className="validation"></i>
          </p>
          <p>
          <input 
            type="quizAnswer3" 
            id="quizAnswer3-add-question" 
            name="quizAnswer3" 
            placeholder="Answer 3" 
            onChange={(e) => setQuizAnswer3(e.target.value)} 
            required />
            <i className="validation"></i>
          </p>
         
          <p>
          <input 
            type="quizAnswer4" 
            id="quizAnswer4-add-question" 
            name="quizAnswer4" 
            placeholder="Answer 4" 
            onChange={(e) => setQuizAnswer4(e.target.value)} 
            required />
            <i className="validation"></i>
          </p>
          
    
          <div id="select-correct-answer-title">Select the correct answer:</div>
          
          <div className='select-correct-answer-section'>
            <label id="option1-label">Ans 1
              <input type="radio" value="answer1" checked={selectedOption === "answer1"} onChange={handleOptionChange} />
            </label>
            <label id="option2-label">Ans 2
              <input type="radio" value="answer2" checked={selectedOption === "answer2"} onChange={handleOptionChange} />
            </label>
            <label id="option3-label">Ans 3
              <input type="radio" value="answer3" checked={selectedOption === "answer3"} onChange={handleOptionChange} />
            </label>
            <label id="option4-label">Ans 4
              <input type="radio" value="answer4" checked={selectedOption === "answer4"} onChange={handleOptionChange} />
            </label>
          </div>

          <p>
          <input 
            type="submit" 
            id="signup" 
            value="Add Question" />
          </p>

        </form>

          <p id='p-finish-add-question'>
            <button id="finish-add-question" onClick={setOpenModal}>FINISH</button> 
          </p>

        
        <div id="leave-page-add-question-wrap">
          <p>Leave the page? 
            <Link to="/quizzes"> Leave</Link>
          </p>
        </div>
    </div>
    )
}
