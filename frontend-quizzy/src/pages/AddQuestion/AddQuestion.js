import { React, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAddQuestion } from '../../hooks/useAddQuestion';
import './AddQuestion.css'
import Modal from '../../components/modal/Modal'
import Popup from '../../components/Popup/Popup';
import { FaCheck } from 'react-icons/fa';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';

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
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(true);

    let navigate = useNavigate();
    let location = useLocation();

    function handlePopup2Close() {
      setShowPopup2(false);
    }
  
    function handlePopupClose() {
      setShowPopup(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addQuestion(quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, location.state.quizKey);
        setShowPopup(true);
    }

    useEffect(()=>{
        if (confirmModal) {
          if (location.state.previousPage === '/create_quiz')
            navigate('/quizzes', {replace: true});
          else if (location.state.previousPage === '/update_quiz')
            navigate(-1, {replace: true});
        }
    }, [confirmModal])

    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }

    return (
      <div className='add-question-wrapper'>

          <div className='add-question-navigation-component'>
              <NavigationComponent
                  pageTitle="Add Question"
                  pairs={[['Questions Sets', '/quizzes'],
                          ['Create Question Set', '/create_quiz'],
                          ['Add Question', '/add_question']
                  ]}
              />
          </div>

        <div id="add-question-form-wrap">
          
          {openModal && <div id='exit-modal-add-question'> 
          <Modal closeModal={setOpenModal} yesModal={setConfirmModal} message="Are you done adding questions? Make sure you added the current question!" /> </div>}
          
          {location.state.previousPage === '/create_quiz' && showPopup2 &&
          (
            <Popup
              message="Quiz successfully created"
              duration={2000}
              position="top-right"
              icon = {<FaCheck className='flag-button' style={{color:"rgb(232, 173, 64)"}}/>}
              onClose={handlePopup2Close}
            />
            )}

          {showPopup && 
          (
            <Popup
              message="Question successfully added"
              duration={2000}
              position="top-right"
              icon = {<FaCheck className='flag-button' style={{color:"rgb(232, 173, 64)"}}/>}
              onClose={handlePopupClose}
            />
          )}

          <h2>Add A New Question</h2>
          <form id="add-question-form" onSubmit={handleSubmit}>
            <p>
            Question text:
            <input 
              type="quizQuestion" 
              id="quizQuestion-add-question" 
              name="quizQuestion" 
              placeholder="Question Text" 
              onChange={(e) => setQuizQuestion(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
            
            <p>
              <p>Question image Upload:</p>
            <input 
              type='file' 
              id='upload-image-btn'
              onChange={(event) => {setImageUpload(event.target.files)}}>
            </input>
            </p>

            <p>
            Answer 1:
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
            Answer 2:
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
            Answer 3:
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
            Answer 4:
            <input 
              type="quizAnswer4" 
              id="quizAnswer4-add-question" 
              name="quizAnswer4" 
              placeholder="Answer 4" 
              onChange={(e) => setQuizAnswer4(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
            
      
            <div id="select-correct-answer-title">Set the correct answer:</div>
            
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
      </div>
    )
}
