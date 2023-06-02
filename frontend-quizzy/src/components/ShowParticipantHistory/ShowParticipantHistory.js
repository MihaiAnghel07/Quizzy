import React from 'react'
import './ShowParticipantHistory.css'
import { projectFirebaseStorage } from '../../firebase/config'
import { RxCheck, RxCross2 } from "react-icons/rx";


class ShowQuiz extends React.Component {

    constructor() {
        super();
        this.state = {
            records: [],
            score: 0
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        let score = 0
        Object.keys(this.props.questions).map(async (key) => {
            // calculez scorul
            if ((this.props.questions[key].answer1.isCorrect && this.props.questions[key].answer1.isSelected)
                || (this.props.questions[key].answer2.isCorrect && this.props.questions[key].answer2.isSelected)
                || (this.props.questions[key].answer3.isCorrect && this.props.questions[key].answer3.isSelected)
                || (this.props.questions[key].answer4.isCorrect && this.props.questions[key].answer4.isSelected)) {
                score++;
            }
            this.setState({score: score});

            // preiau imaginile din baza de date
            if (this.props.questions[key].hasImage) {
                let host = localStorage.getItem("username");
                const image = projectFirebaseStorage.ref('History/participant/' + host + '/quizzes/' + this.props.quizId + '/questions/' + key + '/' + this.props.questions[key].image);
                               
                await image.getDownloadURL().then((url) => {
                    this.props.questions[key] = {
                        answer1: this.props.questions[key].answer1,
                        answer2: this.props.questions[key].answer2,
                        answer3: this.props.questions[key].answer3,
                        answer4: this.props.questions[key].answer4,
                        hasImage: this.props.questions[key].hasImage,
                        image: this.props.questions[key].image,
                        isFlagged: this.props.questions[key].isFlagged,
                        question: this.props.questions[key].question,
                        url: url}
                })
            }
        })
        
        this.setState({records: Object.values(this.props.questions)})
    }

    
    render() {
        return (
            <div> 
                <div className='show-quiz-summary'>Summary</div>
                <div className='show-quiz-score'>Your score: {this.state.score} / {this.state.records.length}</div>
                
                {this.state.records.map((row, index) => {
                    return (
                        <div key={index} className='show-quiz-wrapper'>
                            <div className='show-quiz-question'>{index}. Question: {row.question}</div>
                            {row.hasImage && <img src={row.url} width='600' height='300' alt='question'/>}
                            <div className='show-quiz-answer1'>Answer1: {row.answer1.text}{row.answer1.isSelected && (row.answer1.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                            <div className='show-quiz-answer2'>Answer2: {row.answer2.text}{row.answer2.isSelected && (row.answer2.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                            <div className='show-quiz-answer3'>Answer3: {row.answer3.text}{row.answer3.isSelected && (row.answer3.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                            <div className='show-quiz-answer4'>Answer4: {row.answer4.text}{row.answer4.isSelected && (row.answer4.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                        </div>
                    )
                })}
            </div>
        )
    }
  
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        
        return <Component questions={props.questions}
                          quizId={props.quizId}/>
    }
}

export default wrapClass(ShowQuiz); 
