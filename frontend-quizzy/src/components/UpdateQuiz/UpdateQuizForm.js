import './UpdateQuizForm.css'
import React from 'react'
import firebase from "firebase/app";
import { projectFirebaseRealtime } from '../../firebase/config'



export default class UpdateQuizForm extends React.Component {

    constructor() {
        super();
        this.state = {
            quizData: [],
            username: localStorage.getItem('username')
        }


        this.componentDidMount = this.componentDidMount.bind(this)
    }
    
    componentDidMount() {
        // let records = []

        // const ref = projectFirebaseRealtime.ref('Quizzes/' + this.state.username);
        // ref.child(this.props.quizId).get().then((snapshot) => {
        //     records.push({"author":snapshot.val().Author, 
        //                     "title":snapshot.val().Title,
        //                     "isPublic":snapshot.val().isPublic,
        //                     "questions":snapshot.val().Questions}); 
        // });
        // this.setState({quizData: records});
        // console.log("AA:" + this.state.quizData)
        
 
    } 

    render() {
        
        return (
            <div>werfgfhrty
                {/* {console.log("SSS" + this.state.quizData)} */}
                {/* {this.state.quizData} */}
            </div>
        )
    }
}