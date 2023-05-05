import './Modal.css'
import React from 'react'



export default function Modal({closeModal, yesModal, message}) {

    return (
        <div className='modal-wrapper'>
           <div className='modal-content'>
                <div className='title-close-btn'>
                    <button onClick={() => closeModal(false)}>X</button>
                </div>
                <div className='modal-title'>
                    <h5>{message}</h5>
                </div>
                <div className='modal-body'>
                    
                </div>
                <div className='modal-footer'>
                    <button id='cancel-btn' onClick={() =>closeModal(false)}>Cancel</button>
                    <button onClick={() =>yesModal(true)}>Yes</button>
                </div>
            </div> 
        </div>
    )
}