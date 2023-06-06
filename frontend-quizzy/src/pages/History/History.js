import React, { useEffect, useState } from 'react'
import './History.css'
import { useNavigate } from 'react-router-dom';
import ShowHistory from '../../components/ShowHistory/ShowHistory';

 
class History extends React.Component {
  constructor() {
    super();
    this.state = {
        quizzesData: [],
        hostHistory: true,
        username: localStorage.getItem("username"),
        hostBtnId: "history-host-btn2",
        participantBtnId: "history-participant-btn"

    }
    
    //this.componentDidMount = this.componentDidMount.bind(this)
  }

  hostBtnHandler = (e) => {
    e.preventDefault();
    this.setState({hostBtnId:"history-host-btn2", participantBtnId: "history-participant-btn"})
    this.state.hostHistory = true;
    this.forceUpdate();

  }

  participantBtnHandler = (e) => {
    e.preventDefault();
    this.setState({hostBtnId:"history-host-btn", participantBtnId: "history-participant-btn2"})
    this.state.hostHistory = false;
    this.forceUpdate();

  }

  render () {
    return (
      <div className='history-wrapper'>
        <div className='history-content'>
          <div className='history-header'>

          <input id="search-input"
              placeholder='Search'
              onChange={(e) => this.props.searchInputHandler(e.target.value)} 
          />

            <div className='history-filter-buttons'>
              <h3 id='filter-h3'>Filter:</h3>
              <button id={this.state.hostBtnId}
                      onClick={this.hostBtnHandler}>Host</button>
              <button id={this.state.participantBtnId}
                      onClick={this.participantBtnHandler}>Participant</button>
            </div>
          </div>

          <div className='history-body'>
            <div className="body-show-history">
                {this.state.hostHistory && <ShowHistory historyType="host" search={this.props.search}/> }
                {!this.state.hostHistory && <ShowHistory historyType="participant" search={this.props.search}/>}
                
            </div>
          </div>

        </div>
      </div>
    )
  }

}

function wrapClass (Component) {
  return function WrappedComponent(props) {
      const [openModal, setOpenModal] = useState(false)
      const [confirmModal, setConfirmModal] = useState(false);
      const [quizId, setQuizId] = useState(null)
      const [quizAuthor, setQuizAuthor] = useState(null)
      const [searchInput, setSearchInput] = useState("");
      let navigate = useNavigate();

      useEffect(()=>{
          if (confirmModal) {
            setConfirmModal(false)
            setOpenModal(false)
          }
      
        }, [confirmModal])  

      const openModalHandler = (quizId, quizAuthor)=> {
          setQuizId(quizId)
          setQuizAuthor(quizAuthor)
          setOpenModal(true)
      }

      const searchInputHandler = (input) => {
          setSearchInput(input)
      }

  
      return <Component searchInputHandler={searchInputHandler}
                        search={searchInput} />
  }
}

export default wrapClass(History); 