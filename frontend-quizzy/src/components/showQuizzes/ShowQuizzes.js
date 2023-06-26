import './ShowQuizzes.css'
import React from 'react'
import { projectFirebaseRealtime } from '../../firebase/config'
import { useCopyQuiz } from '../../hooks/useCopyQuiz';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri'
import { GrEdit } from 'react-icons/gr'
import { AiOutlineCopy} from 'react-icons/ai'



class ShowQuizzes extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            username: localStorage.getItem("username")
        }


        this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    componentDidMount() {
        let username = localStorage.getItem("username");
        
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
                    this.props.setQuizDataFilteredHandler(records);
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
                                    childSnapshot2.forEach(childSnapshot3 => {
                                        let key = childSnapshot3.key;
                                        let data = childSnapshot3.val();
                                        if (childSnapshot2.key !== username && data.isPublic === true) {
                                            records.push({"key":key, "data":data}); 
                                        } else if (childSnapshot2.key === username) {
                                            records.push({"key":key, "data":data}); 
                                        }
                                    })
                                    
                                })
                                
                                
                            }
                        })
                        this.setState({quizzesData: records});
                        this.props.setQuizDataFilteredHandler(records);
                    })
                }
            })
        }
 
    } 
    

    render() {
        
        return (
            
            <div id='show-quizzes-wrapper'  style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {this.props.quizDataFiltered.length === 0 &&
                <h4 id="empty-list-message">No Quiz Found</h4>}
                
                <table >   
                    {this.props.quizDataFiltered.length !== 0 && <thead>
                        <tr>
                            <th id="quiz-title">Question Set Title</th>
                            {this.props.quizzesType === 'public' && 
                            <th id="quiz-owner">Owner</th>}
                            {this.props.quizzesType === 'private' && 
                            <th id="quiz-visibility">Visibility</th>}
                            <th id="quiz-commands">Options</th>
                            
                        </tr>
                    </thead>}

                    {this.props.quizDataFiltered.length !== 0 && 
                    <tbody>
                        {this.props.quizDataFiltered.map((row, index) => {
                            return (
                                <tr key={index}>
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
                                        <button id='showQuizzes-copy-button' onClick={() => this.props.copyHandler(row.key, row.data.Author)}><AiOutlineCopy/> Copy</button>}
                                        {this.state.username === row.data.Author &&
                                        <button id='showQuizzes-update-button' onClick={() => this.props.updateHandler(row.key, row.data.Author, row.data.isPublic, row.data.Title)}><GrEdit/>Edit</button>}
                                        {this.state.username === row.data.Author &&
                                        <button id='showQuizzes-delete-button' onClick={() => this.props.openModal(row.key, row.data.Author)}><RiDeleteBinLine />Delete</button>}
                                    </td>
                                </tr>
                            )
                        })}
                        
                    </tbody>}
                </table>
            </div>
        )
    }  
}

function wrapClass (Component) {
    return function WrappedComponent(props) {
        const [quizDataFiltered, setQuizDataFiltered] = useState([])
        const [quizData, setQuizData] = useState([])
        const { copyQuiz } = useCopyQuiz();
        let navigate = useNavigate();

        const copyHandler = (quizId, quizAuthor) => {
            copyQuiz(quizId, quizAuthor);
        }

        const updateHandler = (quizId, quizAuthor, isPublic, quizTitle) => {
            navigate('/update_quiz', {state:{quizId:quizId, quizAuthor:quizAuthor, isPublic:isPublic, quizTitle:quizTitle}});
        }

        const setQuizDataFilteredHandler = (quizData) => {
            setQuizData(quizData)
        }

        useEffect(() => {
            const auxQuizData = quizData.filter((el) => {
                let auxTitle = el.data.Title.toLowerCase();
                let auxAuthor = el.data.Author.toLowerCase();

                
                if (props.search === "")
                    return el;

                if (auxTitle.includes(props.search.toLowerCase()) || auxAuthor.includes(props.search.toLowerCase()))
                    return el;
                
                if (('private'.includes(props.search.toLowerCase()) && el.data.isPublic === false) 
                    || ('public'.includes(props.search.toLowerCase()) && el.data.isPublic === true))
                    return el;
                
            })
            
            setQuizDataFiltered(auxQuizData)


        }, [quizData, props.search])

        
        return <Component quizzesType={props.quizzesType} 
                          path={props.path} 
                          copyHandler={copyHandler}
                          updateHandler={updateHandler}
                          openModal={props.openModalHandler}
                          search={props.search}
                          setQuizDataFilteredHandler={setQuizDataFilteredHandler}
                          quizDataFiltered={quizDataFiltered}/>
    }
}

export default wrapClass(ShowQuizzes); 