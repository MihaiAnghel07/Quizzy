import './ShowQuizzes.css'
import React from 'react'
import { Table } from 'react-bootstrap';
import { projectFirebaseRealtime } from '../../firebase/config'
import firebase from "firebase/app";
import { useCopyQuiz } from '../../hooks/useCopyQuiz';
import { useDeleteQuiz } from '../../hooks/useDeleteQuiz';
import { useNavigate } from 'react-router-dom';



class ShowQuizzes extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            username: firebase.auth().currentUser.displayName
        }


        this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    componentDidMount() {
        let username = firebase.auth().currentUser.displayName;

        if (this.props.quizzesType === 'private') {
            const ref = projectFirebaseRealtime.ref('Quizzes/' + username);
            ref.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    let records = [];
                    snapshot.forEach(childSnapshot => {
                        let key = childSnapshot.key;
                        let data = childSnapshot.val();
                        records.push({"key":key, "data":data}); 
                    })
                    this.setState({quizzesData: records});
                }
            })

        } else if (this.props.quizzesType === 'public') {
            const ref = projectFirebaseRealtime.ref('Quizzes/');
            ref.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const ref2 = projectFirebaseRealtime.ref('Quizzes/');
                    ref2.on('value', (snapshotParticipants) => {
                        let records = [];
                        snapshotParticipants.forEach(childSnapshot => {
                            if (childSnapshot.key !== 'private' && childSnapshot.key !== 'public') {
                                const ref3 = projectFirebaseRealtime.ref('Quizzes/' + childSnapshot.key);
                                ref3.on('value', (childSnapshot2) => {
                                    // console.log("KEY = " + childSnapshot2.key)
                                    childSnapshot2.forEach(childSnapshot3 => {
                                        let key = childSnapshot3.key;
                                        let data = childSnapshot3.val();
                                        if (childSnapshot2.key !== username && data.isPublic === true) {
                                            // console.log(key + '  ' + data.Author)
                                            records.push({"key":key, "data":data}); 
                                        } else if (childSnapshot2.key === username) {
                                            records.push({"key":key, "data":data}); 
                                        }
                                    })
                                    
                                })
                                
                                
                            }
                        })
                        this.setState({quizzesData: records});
                    })
                }
            })
        }
 
    } 

    render() {
        
        return (
            <div id='show-quizzes-wrapper'>
                {this.state.quizzesData.length === 0 &&
                <h4 id="empty-list-message">No Quiz Found</h4>}
                
                <Table >   
                    {this.state.quizzesData.length !== 0 && <thead>
                        <tr>
                            <th id="quiz-id">id</th>
                            <th id="quiz-title">Quiz</th>
                            {this.props.quizzesType === 'public' && 
                            <th id="quiz-owner">Owner</th>}
                            {this.props.quizzesType === 'private' && 
                            <th id="quiz-visibility">Visibility</th>}
                            <th id="quiz-commands">Command</th>
                            
                        </tr>
                    </thead>}

                    {this.state.quizzesData.length !== 0 && <tbody>
                        {this.state.quizzesData.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td>#{row.key}</td>
                                    <td>{row.data.Title}</td>
                                    {this.props.quizzesType === 'public' && 
                                    <td>{row.data.Author}</td>}
                                    {this.props.quizzesType === 'private' &&
                                    row.data.isPublic && <td>Public</td>}
                                    {this.props.quizzesType === 'private' &&
                                    !row.data.isPublic && <td>Private</td>}
                                    <td>
                                        {this.props.quizzesType === 'public' && 
                                        this.state.username !== row.data.Author &&
                                        <button onClick={() => this.props.copyHandler(row.key, row.data.Author)}>Copy</button>}
                                        {this.state.username === row.data.Author &&
                                        <button onClick={() => this.props.updateHandler(row.key)}>Update</button>}
                                        {this.state.username === row.data.Author &&
                                        <button onClick={() => this.props.deleteHandler(row.key, row.data.Author)}>Delete</button>}
                                    </td>

                                </tr>
                            )
                        })}
                        
                    </tbody>}
                </Table>
            </div>
        )
    }  
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        const { copyQuiz } = useCopyQuiz();
        const { deleteQuiz} = useDeleteQuiz();
        let navigate = useNavigate();

        const copyHandler = (quizId, quizAuthor) => {
            copyQuiz(quizId, quizAuthor);
        }

        const updateHandler = (quizId) => {
            console.log("update");
            navigate('/update_quiz', {state:{quizId:quizId}});
        }

        const deleteHandler = (quizId, quizAuthor) => {
            deleteQuiz(quizId, quizAuthor);

        }
        

        return <Component quizzesType={props.quizzesType} 
                          path={props.path} 
                          copyHandler={copyHandler}
                          updateHandler={updateHandler}
                          deleteHandler={deleteHandler}/>
    }
}

export default wrapClass(ShowQuizzes); 