import React from 'react'
import './QuestionEdit.css'
import { useState } from 'react'
import { useUpdateQuestion } from '../../hooks/useUpdateQuestion'

export default function QuestionEdit(props) {

    const [quizQuestion, setQuizQuestion] = useState(props.quizQuestion)
    const [quizAnswer1, setQuizAnswer1] = useState(props.quizAnswer1)
    const [quizAnswer2, setQuizAnswer2] = useState(props.quizAnswer2)
    const [quizAnswer3, setQuizAnswer3] = useState(props.quizAnswer3)
    const [quizAnswer4, setQuizAnswer4] = useState(props.quizAnswer4)
    const [selectedOption, setSelectedOption] = useState(props.quizAnswer1.isCorrect? 'answer1' : 
                                                        props.quizAnswer2.isCorrect? 'answer2' : 
                                                        props.quizAnswer3.isCorrect? 'answer3' : 'answer4');
    const [imageUpload, setImageUpload] = useState(null);
    const {updateQuestion} = useUpdateQuestion();

    
    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateQuestion(quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, props.questionKey, props.quizKey, props.quizAuthor);
    }

  return (
    <div id="edit-question-form-wrap">
        <form id="edit-question-form" onSubmit={handleSubmit}>
        <p>
        Question Text:
        <input 
            type="quizQuestion" 
            id="quizQuestion-edit-question" 
            name="quizQuestion" 
            value={quizQuestion} 
            onChange={(e) => setQuizQuestion(e.target.value)} 
            required />
            <i className="validation"></i>
        </p>

        <p>
        Image Upload:
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
            id="quizAnswer1-edit-question" 
            name="quizAnswer1" 
            value={quizAnswer1.text} 
            onChange={(e) => setQuizAnswer1({'text':e.target.value, 'isCorrect':quizAnswer1.isCorrect})} 
            required />
            <i className="validation"></i>
        </p>

        <p>
        Answer 2:
        <input 
            type="quizAnswer2" 
            id="quizAnswer2-edit-question" 
            name="quizAnswer2" 
            value={quizAnswer2.text}  
            onChange={(e) => setQuizAnswer2({'text':e.target.value, 'isCorrect':quizAnswer2.isCorrect})} 
            required />
            <i className="validation"></i>
        </p>
        
        <p>
        Answer 3:
        <input 
            type="quizAnswer3" 
            id="quizAnswer3-edit-question" 
            name="quizAnswer3" 
            value={quizAnswer3.text} 
            onChange={(e) => setQuizAnswer3({'text':e.target.value, 'isCorrect':quizAnswer3.isCorrect})} 
            required />
            <i className="validation"></i>
        </p>
        
        <p>
        Answer 4:
        <input 
            type="quizAnswer4" 
            id="quizAnswer4-edit-question" 
            name="quizAnswer4" 
            value={quizAnswer4.text} 
            onChange={(e) => setQuizAnswer4({'text':e.target.value, 'isCorrect':quizAnswer4.isCorrect})} 
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
        <p>
          <input 
            type="submit" 
            id="save" 
            value="Save" />
          </p>

        </form>

    </div>
  )
}
