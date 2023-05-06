import React from 'react'
import './ShowParticipants.css'
import { Table } from 'react-bootstrap';
import { projectFirebaseRealtime } from '../../firebase/config'



export default class ShowParticipants extends React.Component {

    constructor() {
        super();
        this.state = {
            participantsData: []
        }
    
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        const ref = projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode);
 
        ref.on('value', (snapshot) => {
            if (snapshot.child('/participants').exists()) {
                
                const ref2 = projectFirebaseRealtime.ref('Lobbies/' + this.props.lobbyCode + '/participants');
                ref2.on('value', (snapshotParticipants) => {
                    let records = [];
                    snapshotParticipants.forEach(childSnapshot => {
                        let keyName = childSnapshot.key;
                        let data = childSnapshot.val();
                        records.push({"key":keyName, "data":data}); 
                    })
                    this.setState({participantsData: records});
                })
            }}
        )
    }

    render() {
        
        return (
            <Table >

                
                {this.state.participantsData.length != 0 && <thead>
                    <tr>
                        <th id="id">id</th>
                        <th id="username">Username</th>
                    </tr>
                </thead>}

                {this.state.participantsData.length != 0 && <tbody>
                    {this.state.participantsData.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td>{row.key}</td>
                                <td>{row.data.name}</td>
                            </tr>
                        )
                    })}
                    
                </tbody>}
            </Table>
        )
    }

    
}