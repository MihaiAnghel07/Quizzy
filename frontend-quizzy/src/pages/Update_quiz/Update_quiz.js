import './Update_quiz.css'
import UpdateQuizForm from '../../components/UpdateQuiz/UpdateQuizForm';
import { useLocation } from 'react-router-dom';

export default function Update_quiz(props) {
    const location = useLocation();
    return (
        <div className='update-quiz-wrapper'>
            <div className='update-quiz-content'>
                <div className='update-quiz-form-wrapper'>
                    <UpdateQuizForm quizId={location.state.quizId}/>
                </div>
            </div>
        </div>
    )

}