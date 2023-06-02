import React from 'react'
import './ShowHostHistory.css'


class ShowHostHistory extends React.Component {

    constructor() {
        super();
        this.state = {
            records: [],
            score: 0
        }

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                <div className='show-host-history-participants'>Participants</div>
            </div>
        )
    }
}


function wrapClass (Component) {
    return function WrappedComponent(props) {
        
        return <Component />
    }
}

export default wrapClass(ShowHostHistory); 