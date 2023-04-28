import BouncingDotsLoader from '../../components/BouncingDotsLoader/BouncingDotsLoader'
import './Participant_lobby.css'
import React from 'react'


export default function Participant_lobby() {
    return (
        <div className='participant-lobby-wrapper'>
            <div className='participant-lobby-content'>
                <h4>Waiting for quiz starting </h4>
                <div id='bouncing-dots-loader'><BouncingDotsLoader/></div>
                
            </div>
        </div>
    )

}
