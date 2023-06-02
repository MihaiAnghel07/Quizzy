import React from 'react'
import './ShowQuiz.css'
import { projectFirebaseRealtime, projectFirebaseStorage } from '../../firebase/config'


class ShowQuiz extends React.Component {

    constructor() {
        super();
        this.state = {
            records: []
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        Object.keys(this.props.questions).map((key) => {
            if (this.props.questions[key].hasImage) {
                let host = localStorage.getItem("username");
                const image = projectFirebaseStorage.ref('History/participant/' + host + '/quizzes/' + this.props.quizId + '/questions/' + key + '/' + this.props.questions[key].image);

            }
        })
        
        
        
        this.setState({records: Object.values(this.props.questions)})
    }

    
    render() {
        return (
            <div>
                {this.state.records.map((row, index) => {
                    // console.log(row)
                    return (
                        <div key={index} className='show-quiz-wrapper'>
                            <div className='show-quiz-question'>Question: {row.question}</div>
                            {/* <img src={this.state.quizData[this.state.currentQuestionCount].url} width='700' height='400'/>} */}
                            <div className='show-quiz-answer1'>Answer1: {row.answer1.text}</div>
                            <div className='show-quiz-answer2'>Answer2: {row.answer2.text}</div>
                            <div className='show-quiz-answer3'>Answer3: {row.answer3.text}</div>
                            <div className='show-quiz-answer4'>Answer4: {row.answer4.text}</div>
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
