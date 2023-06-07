import React from 'react'
import './QuestionEdit.css'
import { useState } from 'react'
import { useUpdateQuestion } from '../../hooks/useUpdateQuestion'
import { projectFirebaseRealtime, projectFirebaseStorage } from '../../firebase/config';

class QuestionEdit extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            url: null,
        }

        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleOptionChange= this.handleOptionChange.bind(this)
    }

    async componentDidMount() {
        
        const ref = projectFirebaseRealtime.ref("Quizzes/" + this.props.quizAuthor + "/" + this.props.quizKey + "/Questions/" + this.props.questionKey);
        await ref.once("value", async (snapshot) => {
    
            if (snapshot.exists()) {
                if (snapshot.val().hasImage) {
                    
                    const image = projectFirebaseStorage.ref("Images/" + this.props.quizAuthor + "/" + this.props.quizKey + "/Questions/" + this.props.questionKey + "/" + snapshot.val().image);
                    await image.getDownloadURL().then((url) => {
                        this.setState({url:url});
                    })
                }
            }
        })
    
    }

    
    handleOptionChange(event) {
        this.props.setSelectedOption(event.target.value);
    }


    render() {
        return (
            <div id="edit-question-form-wrap">
                <form id="edit-question-form" onSubmit={(e) => this.props.handleSubmit(e)}>
                <p>
                Question Text:
                <input 
                    type="quizQuestion" 
                    id="quizQuestion-edit-question" 
                    name="quizQuestion" 
                    value={this.props.quizQuestion} 
                    onChange={(e) => this.props.setQuizQuestion(e.target.value)} 
                    required />
                    <i className="validation"></i>
                </p>

                <p>
                Question Image Upload:
                <input 
                    type='file' 
                    id='upload-image-btn'
                    onChange={(event) => {this.props.setImageUpload(event.target.files)}}>
                </input>
                </p>

                {this.state.url !== null &&
                    <img src={this.state.url} width='50%' height='30%' alt='question'/>
                }
                
                <p>
                Answer 1:
                <input 
                    type="quizAnswer1" 
                    id="quizAnswer1-edit-question" 
                    name="quizAnswer1" 
                    value={this.props.quizAnswer1.text} 
                    onChange={(e) => this.props.setQuizAnswer1({'text':e.target.value, 'isCorrect':this.props.quizAnswer1.isCorrect})} 
                    required />
                    <i className="validation"></i>
                </p>

                <p>
                Answer 2:
                <input 
                    type="quizAnswer2" 
                    id="quizAnswer2-edit-question" 
                    name="quizAnswer2" 
                    value={this.props.quizAnswer2.text}  
                    onChange={(e) => this.props.setQuizAnswer2({'text':e.target.value, 'isCorrect':this.props.quizAnswer2.isCorrect})} 
                    required />
                    <i className="validation"></i>
                </p>
                
                <p>
                Answer 3:
                <input 
                    type="quizAnswer3" 
                    id="quizAnswer3-edit-question" 
                    name="quizAnswer3" 
                    value={this.props.quizAnswer3.text} 
                    onChange={(e) => this.props.setQuizAnswer3({'text':e.target.value, 'isCorrect':this.props.quizAnswer3.isCorrect})} 
                    required />
                    <i className="validation"></i>
                </p>
                
                <p>
                Answer 4:
                <input 
                    type="quizAnswer4" 
                    id="quizAnswer4-edit-question" 
                    name="quizAnswer4" 
                    value={this.props.quizAnswer4.text} 
                    onChange={(e) => this.props.setQuizAnswer4({'text':e.target.value, 'isCorrect':this.props.quizAnswer4.isCorrect})} 
                    required />
                    <i className="validation"></i>
                </p>
                

                <div id="edit-select-correct-answer-title">Select the correct answer:</div>
                
                <div className='edit-select-correct-answer-section'>
                    <label id="edit-option1-label">Ans 1
                    <input type="radio" value="answer1" checked={this.props.selectedOption === "answer1"} onChange={this.handleOptionChange} />
                    </label>
                    <label id="edit-option2-label">Ans 2
                    <input type="radio" value="answer2" checked={this.props.selectedOption === "answer2"} onChange={this.handleOptionChange} />
                    </label>
                    <label id="edit-option3-label">Ans 3
                    <input type="radio" value="answer3" checked={this.props.selectedOption === "answer3"} onChange={this.handleOptionChange} />
                    </label>
                    <label id="edit-option4-label">Ans 4
                    <input type="radio" value="answer4" checked={this.props.selectedOption === "answer4"} onChange={this.handleOptionChange} />
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
}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        const {updateQuestion} = useUpdateQuestion();
        const [quizQuestion, setQuizQuestion] = useState(props.quizQuestion)
        const [quizAnswer1, setQuizAnswer1] = useState(props.quizAnswer1)
        const [quizAnswer2, setQuizAnswer2] = useState(props.quizAnswer2)
        const [quizAnswer3, setQuizAnswer3] = useState(props.quizAnswer3)
        const [quizAnswer4, setQuizAnswer4] = useState(props.quizAnswer4)
        const [selectedOption, setSelectedOption] = useState(props.quizAnswer1.isCorrect? 'answer1' : 
                                                            props.quizAnswer2.isCorrect? 'answer2' : 
                                                            props.quizAnswer3.isCorrect? 'answer3' : 'answer4');
        const [imageUpload, setImageUpload] = useState(null);
        
        const handleSubmit = (e) => {
            e.preventDefault()
            updateQuestion(quizQuestion, quizAnswer1, quizAnswer2, quizAnswer3, quizAnswer4, selectedOption, imageUpload, props.questionKey, props.quizKey, props.quizAuthor);
        }
   
        return <Component 
                        handleSubmit={handleSubmit}
                        quizQuestion={quizQuestion}
                        quizAnswer1={quizAnswer1}
                        quizAnswer2={quizAnswer2}
                        quizAnswer3={quizAnswer3}
                        quizAnswer4={quizAnswer4}
                        selectedOption={selectedOption}
                        imageUpload={imageUpload}
                        setQuizQuestion={setQuizQuestion}
                        setQuizAnswer1={setQuizAnswer1}
                        setQuizAnswer2={setQuizAnswer2}
                        setQuizAnswer3={setQuizAnswer3}
                        setQuizAnswer4={setQuizAnswer4}
                        setSelectedOption={setSelectedOption}
                        setImageUpload={setImageUpload}
                        quizKey={props.quizKey}
                        quizAuthor={props.quizAuthor}
                        questionKey={props.questionKey}
                        />
    }
}

export default wrapClass(QuestionEdit); 
