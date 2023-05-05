import './Create_quiz.css'
import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useCreateQuiz } from '../../hooks/useCreateQuiz';
import { useAddQuestion } from '../../hooks/useAddQuestion';

export default function Create_quiz() {
  
    const [quizTitle, SetQuizTitle] = useState('')
    const [quizQuestion, setQuizQuestion] = useState('')
    const [quizAnswer1, setQuizAnswer1] = useState('')
    const [quizAnswer2, setQuizAnswer2] = useState('')
    const [quizAnswer3, setQuizAnswer3] = useState('')
    const [quizAnswer4, setQuizAnswer4] = useState('')
    const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const { createQuiz, isQuizCreated, error, quizKey} = useCreateQuiz()
    const { addQuestion } = useAddQuestion()
    const [selectedOption, setSelectedOption] = useState('');

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!isQuizCreated) {
            createQuiz(quizTitle, quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, quizCorrectAnswer, isPublic);
        } else {
            addQuestion(quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, quizCorrectAnswer, quizKey);
        } 

    }

    const handlePrivateButton = (e) => {
        e.preventDefault()
        setIsPublic(false);
        
        let root = document.querySelector(':root');
    
        root.style.setProperty('--private-background-color', '#3ca9e2');
        root.style.setProperty('--private-color', '#ffffff');

        root.style.setProperty('--public-background-color', '#dddddd');
        root.style.setProperty('--public-color', '#000000');
        
    }

    const handlePublicButton = (e) => {
        e.preventDefault()
        setIsPublic(true);
        
        let root = document.querySelector(':root');
        root.style.setProperty('--private-background-color', '#dddddd');
        root.style.setProperty('--private-color', '#000000');

        root.style.setProperty('--public-background-color', '#3ca9e2');
        root.style.setProperty('--public-color', '#ffffff');
        
    }


    return (
        <div id="create-quiz-form-wrap">
          {!isQuizCreated && <h2>Create A New Quiz</h2>}
          {isQuizCreated && <h2>Add A New Question</h2>}
          <form id="create-quiz-form" onSubmit={handleSubmit}>
          {!isQuizCreated && <p>
            <input 
              type="quizTitle" 
              id="quizTitle-create-quiz" 
              name="quizTitle" 
              placeholder="Quiz Tilte" 
              onChange={(e) => SetQuizTitle(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>}
            <p>
            <input 
              type="quizQuestion" 
              id="quizQuestion-create-quiz" 
              name="quizQuestion" 
              placeholder="Quiz Question" 
              onChange={(e) => setQuizQuestion(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
            <p>
            <input 
              type="quizAnswer1" 
              id="quizAnswer1-create-quiz" 
              name="quizAnswer1" 
              placeholder="Answer 1" 
              onChange={(e) => setQuizAnswer1(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
            <p>
            <input 
              type="quizAnswer2" 
              id="quizAnswer2-create-quiz" 
              name="quizAnswer2" 
              placeholder="Answer 2" 
              onChange={(e) => setQuizAnswer2(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
            <p>
            <input 
              type="quizAnswer3" 
              id="quizAnswer3-create-quiz" 
              name="quizAnswer3" 
              placeholder="Answer 3" 
              onChange={(e) => setQuizAnswer3(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
           
            <p>
            <input 
              type="quizAnswer4" 
              id="quizAnswer4-create-quiz" 
              name="quizAnswer4" 
              placeholder="Answer 4" 
              onChange={(e) => setQuizAnswer4(e.target.value)} 
              required />
              <i className="validation"></i>
            </p>
            
            {/* <p>
            <input 
              type="quizCorrectAnswer" 
              id="quizCorrectAnswer-create-quiz" 
              name="quizCorrectAnswer" 
              placeholder="Correct Answer" 
              onChange={(e) => setQuizCorrectAnswer(e.target.value)} 
              required />
              <i className="validation"></i>
            </p> */}
            <div>
      <label>
        <input type="radio" value="option1" checked={selectedOption === "option1"} onChange={handleOptionChange} />
        Option 1
      </label>
      <label>
        <input type="radio" value="option2" checked={selectedOption === "option2"} onChange={handleOptionChange} />
        Option 2
      </label>
      <label>
        <input type="radio" value="option3" checked={selectedOption === "option3"} onChange={handleOptionChange} />
        Option 3
      </label>
      <label>
        <input type="radio" value="option4" checked={selectedOption === "option4"} onChange={handleOptionChange} />
        Option 4
      </label>
    </div>

            {!isQuizCreated &&
            <div className='private-public-btns'>
                <button id='private-quiz-button' onClick={handlePrivateButton} >Private</button>
                <button id='public-quiz-button' onClick={handlePublicButton} >Public</button>
            </div> }

            {!isQuizCreated && <p>
            <input 
              type="submit" 
              id="signup" 
              value="Create Quiz" />
            </p>}

            {isQuizCreated && <p>
            <input 
              type="submit" 
              id="signup" 
              value="Add Question" />
            </p>}

            {error &&<p className='showError'>{error}</p>}
          </form>
    
          <div id="leave-page-create-quiz-wrap">
            <p>Leave the page? 
              <Link to="/dashboard"> Leave</Link>
            </p>
          </div>
      </div>
      )
}