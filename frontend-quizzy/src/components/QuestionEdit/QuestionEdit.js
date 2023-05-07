import React from 'react'
import './QuestionEdit.css'
import { useState } from 'react'

export default function QuestionEdit(props) {

    const [quizQuestion, setQuizQuestion] = useState(props.quizQuestion)
    const [quizAnswer1, setQuizAnswer1] = useState(props.quizAnswer1)
    const [quizAnswer2, setQuizAnswer2] = useState(props.quizAnswer2)
    const [quizAnswer3, setQuizAnswer3] = useState(props.quizAnswer3)
    const [quizAnswer4, setQuizAnswer4] = useState(props.quizAnswer4)
    const [selectedOption, setSelectedOption] = useState('answer1');
    const [imageUpload, setImageUpload] = useState(null);

    
    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }

  return (
    <div id="edit-question-form-wrap">
        <form id="edit-question-form">
        <p>
        <input 
            type="quizQuestion" 
            id="quizQuestion-edit-question" 
            name="quizQuestion" 
            placeholder={quizQuestion} 
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
            id="quizAnswer1-edit-question" 
            name="quizAnswer1" 
            placeholder={quizAnswer1.text} 
            onChange={(e) => setQuizAnswer1(e.target.value)} 
            required />
            <i className="validation"></i>
        </p>
        <p>
        <input 
            type="quizAnswer2" 
            id="quizAnswer2-edit-question" 
            name="quizAnswer2" 
            placeholder={quizAnswer2.text}  
            onChange={(e) => setQuizAnswer2(e.target.value)} 
            required />
            <i className="validation"></i>
        </p>
        <p>
        <input 
            type="quizAnswer3" 
            id="quizAnswer3-edit-question" 
            name="quizAnswer3" 
            placeholder={quizAnswer3.text} 
            onChange={(e) => setQuizAnswer3(e.target.value)} 
            required />
            <i className="validation"></i>
        </p>
        
        <p>
        <input 
            type="quizAnswer4" 
            id="quizAnswer4-edit-question" 
            name="quizAnswer4" 
            placeholder={quizAnswer4.text} 
            onChange={(e) => setQuizAnswer4(e.target.value)} 
            required />
            <i className="validation"></i>
        </p>
        

        <div id="edit-select-correct-answer-title">Select the correct answer:</div>
        
        <div className='edit-select-correct-answer-section'>
            <label id="edit-option1-label">Ans 1
            <input type="radio" value="answer1" checked={selectedOption === "answer1"} onChange={handleOptionChange} />
            </label>
            <label id="edit-option2-label">Ans 2
            <input type="radio" value="answer2" checked={selectedOption === "answer2"} onChange={handleOptionChange} />
            </label>
            <label id="edit-option3-label">Ans 3
            <input type="radio" value="answer3" checked={selectedOption === "answer3"} onChange={handleOptionChange} />
            </label>
            <label id="edit-option4-label">Ans 4
            <input type="radio" value="answer4" checked={selectedOption === "answer4"} onChange={handleOptionChange} />
            </label>
        </div>

        </form>

    </div>
  )
}
