import React from 'react'
import './Contact.css'
import { VscLocation } from 'react-icons/vsc';
import { AiOutlineMail } from 'react-icons/ai';
import {AiOutlinePhone} from 'react-icons/ai';
import Rating from '../../components/Rating/Rating';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';
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
    {/* <div> */}
      {/* <div className='contact-navigation-component'>
        <NavigationComponent
          pageTitle="Contact"
          pairs={[]
          }
        />
      </div> */}
    
      <h2 className='contact-title'>Contact</h2>

      <div className='Contact-wrapper'>
        
        <div className='Contact-content'>
          {/* <h4 className='Contact-header'>Contact</h4> */}
          <div className='Contact-body'>
            <p><VscLocation/> Adress: Splaiul Independentei 290, Bucharest, Romania</p>
            <p><AiOutlineMail/>  E-mail: quizzy@yahoo.com</p>
            <p><AiOutlinePhone/>  Phone: (+40)765 002 291</p>
          </div>
        </div>
        {/* <Rating/> */}
      </div>
    {/* </div> */}
    </motion.div>
  )
}
