import './Modal.css'
import React from 'react'



export default function Modal({closeModal, yesModal}) {

    return (
        <div className='modal-wrapper'>
           <div className='modal-content'>
                <div className='title-close-btn'>
                    <button onClick={() => closeModal(false)}>X</button>
                </div>
                <div className='modal-title'>
                    <h5>Are you sure you want to close the lobby?</h5>
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