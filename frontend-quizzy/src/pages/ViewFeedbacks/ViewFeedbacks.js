import React from 'react'
import './ViewFeedbacks.css'
import { useLocation } from 'react-router-dom';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';
import { projectFirebaseRealtime } from '../../firebase/config';
import Feedback from 'react-bootstrap/esm/Feedback';

class ViewFeedbacks extends React.Component {

    constructor() {
        super();
        this.state = {
            records: [],
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    async componentDidMount() {
        let feedbacks = [];
        let feedbacks2 = [];
        
        const ref = projectFirebaseRealtime.ref("History/host/" + localStorage.getItem("username") + "/quizzes/" + this.props.quizId + "/feedbacks/");
        await ref.once("value", (snapshot) => {
            if (snapshot.exists()) {
                feedbacks = snapshot.val();
            }
        })

        Object.keys(feedbacks).map((key) => {
            feedbacks2.push(feedbacks[key]);
        })

        this.setState({records: feedbacks2});
    }

    render () {
        return (
            <div className='view-feedbacks-wrapper'>

                <div className='view-feedbacks-navigation-component'>
                    <NavigationComponent
                        pageTitle="Quiz Feedbacks"
                        pairs={[['History', '/history'],
                                ['Quiz Feedbacks', '/view_feedbacks']
                        ]}
                    />
                </div>
                
                {this.state.records.length === 0 && <div className='view-feedbacks-no-feedback-found'>No feedback was found</div>} 

                {this.state.records.length !== 0 && <div className='view-feedbacks-body'>
                    {this.state.records.map((el, key) => {
                        return (
                            <div className='view-feedbacks-item' key={el.key}>
                                {key}. {el.feedback}
                            </div>
                        )
                    })}
                </div>
                }

            </div>
        )
    }
}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        let location = useLocation();
        
        
        return <Component quizId={location.state.quizId}/>
    }
}

export default wrapClass(ViewFeedbacks); 