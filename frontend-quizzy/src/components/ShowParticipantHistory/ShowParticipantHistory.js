import React from 'react'
import './ShowParticipantHistory.css'
import { projectFirebaseStorage } from '../../firebase/config'
import { RxCheck, RxCross2 } from "react-icons/rx";
import { FaFontAwesomeFlag } from 'react-icons/fa';


class ShowParticipantHistory extends React.Component {

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
                let host;
                let image;
                
                if (this.props.participant) {
                    // daca afisez din host (click pe lista de participanti)
                    let participant = this.props.participant;
                    host = localStorage.getItem("username");
                    image = projectFirebaseStorage.ref('History/host/' + host + '/quizzes/' + this.props.quizId + '/' + participant + '/questions/' + key + '/' + this.props.questions[key].image);
                    
                } else {
                    // daca afisez istoricul hostului ca participant
                    host = localStorage.getItem("username");
                    image = projectFirebaseStorage.ref('History/participant/' + host + '/quizzes/' + this.props.quizId + '/questions/' + key + '/' + this.props.questions[key].image);

                }

                               
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
            this.setState({records: Object.values(this.props.questions)})
        })
        
        
    }

    
    render() {
        return (
            <div className='show-participant-history-wrapper'> 
                <div className='show-participant-history-summary'>Summary</div>
                <div className='show-participant-history-score'>Your score: {this.state.score} / {this.state.records.length}</div>
                
                {this.state.records.map((row, index) => {
                    return (
                        <div key={index} className='show-participant-history-wrapper'>

                            <span className='show-participant-history-question'>
                                <span>{row.isFlagged && <FaFontAwesomeFlag className='flag-button-history' title='Flag this question'/>} </span>
                                {index + 1}. Question: {row.question}</span>
                            
                            <div></div>

                            {row.hasImage && <img src={row.url} width='40%' height='20%' alt='question'/>}
                            <div className={row.answer1.isSelected && (row.answer1.isCorrect ? "correct-answer" : "incorrect-answer")}>Answer1: {row.answer1.text}{row.answer1.isSelected && (row.answer1.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                            <div className={row.answer2.isSelected && (row.answer2.isCorrect ? "correct-answer" : "incorrect-answer")}>Answer2: {row.answer2.text}{row.answer2.isSelected && (row.answer2.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                            <div className={row.answer3.isSelected && (row.answer3.isCorrect ? "correct-answer" : "incorrect-answer")}>Answer3: {row.answer3.text}{row.answer3.isSelected && (row.answer3.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
                            <div className={row.answer4.isSelected && (row.answer4.isCorrect ? "correct-answer" : "incorrect-answer")}>Answer4: {row.answer4.text}{row.answer4.isSelected && (row.answer4.isCorrect ? <RxCheck style={{color:'green'}}/> : <RxCross2 style={{color:'red'}}/>)}</div>
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
                          quizId={props.quizId}
                          participant={props.participant}/>
    }
}

export default wrapClass(ShowParticipantHistory); 
