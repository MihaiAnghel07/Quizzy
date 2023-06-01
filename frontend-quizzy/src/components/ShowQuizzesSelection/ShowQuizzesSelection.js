import React, { useEffect, useState } from 'react'
import './ShowQuizzesSelection.css'
import { Table } from 'react-bootstrap';
import { projectFirebaseRealtime } from '../../firebase/config'
import firebase from "firebase/app";
import { useNavigate } from 'react-router-dom';


class ShowQuizzesSelection extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: [],
            //username: firebase.auth().currentUser.displayName
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
                            <th id="quiz-title">Question Set Title</th>
                            {this.props.quizzesType === 'public' && 
                            <th id="quiz-owner">Owner</th>}
                            {this.props.quizzesType === 'private' && 
                            <th id="quiz-visibility">Visibility</th>}
                            <th id="quiz-commands">Options</th>
                            
                        </tr>
                    </thead>}

                    {this.state.quizzesData.length !== 0 && <tbody>
                        {this.state.quizzesData.map((row, index) => {
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
                                        <button id='showQuizzesSelection-select-button' onClick={() => this.props.selectHandler(row.key, row.data.Author, row.data.Title)}>Select</button>
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
        let navigate = useNavigate();
        const [quizDataFiltered, setQuizDataFiltered] = useState([])
        const [quizData, setQuizData] = useState([])
        
        const selectHandler = (quizId, quizAuthor, quizTitle) => {
            navigate('/create_lobby', {state:{quizId:quizId, quizAuthor:quizAuthor, quizTitle:quizTitle}, replace: true})
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
                
                if (('private'.includes(props.search.toLowerCase()) && el.data.isPublic === false) || ('public'.includes(props.search.toLowerCase()) && el.data.isPublic === true))
                    return el;
                
                // de facut si pentru id
                // if ((el.data.quizId.includes(props.search.toLowerCase()) && el.data.isPublic === false))
                //     return el;
                
                
            })
            setQuizDataFiltered(auxQuizData)


        }, [quizData, props.search])

        return <Component quizzesType={props.quizzesType} 
                          path={props.path} 
                          selectHandler={selectHandler}
                          search={props.search}
                          setQuizDataFilteredHandler={setQuizDataFilteredHandler}
                          quizDataFiltered={quizDataFiltered}/>
    }
}

export default wrapClass(ShowQuizzesSelection); 