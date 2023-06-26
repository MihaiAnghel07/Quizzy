import React, { useEffect, useState } from 'react'
import './History.css'
import ShowHistory from '../../components/ShowHistory/ShowHistory';
import { motion } from "framer-motion"

 
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
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='dashboard-wrapper'
      >

        <h2 className='history-title'>History</h2>

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
      </motion.div>
    )
  }

}

function wrapClass (Component) {
  return function WrappedComponent(props) {
      const [searchInput, setSearchInput] = useState(""); 

      const searchInputHandler = (input) => {
          setSearchInput(input)
      }
      
      localStorage.setItem("selectedButton", "history");
      return <Component searchInputHandler={searchInputHandler}
                        search={searchInput} />
  }
}

export default wrapClass(History); 