import './ShowQuizzes.css'
import React from 'react'
import { Table } from 'react-bootstrap';
import { projectFirebaseRealtime } from '../../firebase/config'

export default class ShowQuizzes extends React.Component {

    constructor() {
        super();
        this.state = {
            quizzesData: []
        }
    
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        const ref = projectFirebaseRealtime.ref('Quizzes/');
 
        ref.on('value', (snapshot) => {
            if (snapshot.child(this.props.quizzesType).exists()) {
                
                const ref2 = projectFirebaseRealtime.ref('Quizzes/' + this.props.quizzesType + '/' + this.props.path);
                ref2.on('value', (snapshotParticipants) => {
                    let records = [];
                    snapshotParticipants.forEach(childSnapshot => {
                        let key = childSnapshot.key;
                        let data = childSnapshot.val();
                        if (key != 'noQuizzes')
                            records.push({"key":key, "data":data}); 
                    })
                    this.setState({quizzesData: records});
                })
            }
        })
    }

    render() {
        
        return (
            <Table >
                {this.state.quizzesData.length != 0 &&
                <caption id="participants">Participants</caption>}
                
                {this.state.quizzesData.length != 0 && <thead>
                    <tr>
                        <th id="id">id</th>
                        <th id="username">Quiz</th>
                    </tr>
                </thead>}

                {this.state.quizzesData.length != 0 && <tbody>
                    {this.state.quizzesData.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td>{row.key}</td>
                                <td>{row.data.Title}  | {row.data.Author}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>}
            </Table>
        )
    }

    
}