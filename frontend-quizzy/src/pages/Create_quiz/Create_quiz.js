import './Create_quiz.css'
import { React, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useCreateQuiz } from '../../hooks/useCreateQuiz';
import { useAddQuestion } from '../../hooks/useAddQuestion';
import Modal from '../../components/modal/Modal'
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';

export default function Create_quiz() {
  
    const [quizTitle, SetQuizTitle] = useState('')
    const [quizQuestion, setQuizQuestion] = useState('')
    const [quizAnswer1, setQuizAnswer1] = useState('')
    const [quizAnswer2, setQuizAnswer2] = useState('')
    const [quizAnswer3, setQuizAnswer3] = useState('')
    const [quizAnswer4, setQuizAnswer4] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const { createQuiz, error, quizKey} = useCreateQuiz()
    const [selectedOption, setSelectedOption] = useState('answer1');
    const [imageUpload, setImageUpload] = useState(null);
    let navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        createQuiz(quizTitle, quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, isPublic);
    }

    const handlePrivateButton = (e) => {
        e.preventDefault()
        setIsPublic(false);
        
        let root = document.querySelector(':root');
    
        root.style.setProperty('--private-background-color', 'orange');
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

        root.style.setProperty('--public-background-color', 'orange');
        root.style.setProperty('--public-color', '#ffffff');
        
    }

    function handleOptionChange(event) {
      setSelectedOption(event.target.value);
    }

    useEffect(() => {
      if (quizKey !== null)
        navigate('/add_question', {state:{quizKey:quizKey, previousPage:'/create_quiz'}, replace: true});
    }, [quizKey])


    return (
        <div className='create-quiz-wrapper'>

          <div className='create-quiz-navigation-component'>
              <NavigationComponent
                  pageTitle="Create Question Set"
                  pairs={[['Questions Sets', '/quizzes'],
                          ['Create Question Set', '/create_quiz']
                  ]}
              />
          </div>

          <div id="create-quiz-form-wrap">
            
            <h2>Create A New Question Set</h2>
            <form id="create-quiz-form" onSubmit={handleSubmit}>
            <p>
              Question Set Title:
              <input 
                type="quizTitle" 
                id="quizTitle-create-quiz" 
                name="quizTitle" 
                placeholder="Question Set Tilte" 
                onChange={(e) => SetQuizTitle(e.target.value)} 
                required />
                <i className="validation"></i>
              </p>

              <p>
                Question Text:
              <input 
                type="quizQuestion" 
                id="quizQuestion-create-quiz" 
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
                id="quizAnswer1-create-quiz" 
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
                id="quizAnswer2-create-quiz" 
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
                id="quizAnswer3-create-quiz" 
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
                id="quizAnswer4-create-quiz" 
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

              <div className='private-public-btns'>
                  <button id='private-quiz-button' onClick={handlePrivateButton} >Private</button>
                  <button id='public-quiz-button' onClick={handlePublicButton} >Public</button>
              </div>

              <p>
              <input 
                type="submit" 
                id="signup" 
                value="Create Quiz" />
              </p>

              {error &&<p className='showError'>{error}</p>}

            </form>

            <div id="leave-page-create-quiz-wrap">
              <p>Leave the page? 
                <Link to="/quizzes"> Leave</Link>
              </p>
            </div>
          </div>
        </div>
      )
}