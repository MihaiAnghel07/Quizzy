import React from 'react'
import './Contact.css'
import { VscLocation } from 'react-icons/vsc';
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { motion } from "framer-motion"

export default function Contact() {
  localStorage.setItem("selectedButton", "contact");
  
  return (
    <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className='dashboard-wrapper'
      >
    
      <h2 className='contact-title'>Contact</h2>

      <div className='Contact-wrapper'>
        
        <div className='Contact-content'>
          <div className='Contact-body'>
            <p><VscLocation/> Adress: Splaiul Independentei 290, Bucharest, Romania</p>
            <p><AiOutlineMail/>  E-mail: quizzy@yahoo.com</p>
            <p><AiOutlinePhone/>  Phone: (+40)765 002 291</p>
          </div>
        </div>

      </div>

    </motion.div>
  )
}
