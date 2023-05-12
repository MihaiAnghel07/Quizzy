import React from 'react'
import './Contact.css'
import { VscLocation } from 'react-icons/vsc';
import { AiOutlineMail } from 'react-icons/ai';
import {AiOutlinePhone} from 'react-icons/ai';
import Rating from '../../components/Rating/Rating';
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';

export default function Contact() {
  return (
    <div className='Contact-wrapper'>
      <NavigationComponent
        pageTitle="Contact"
        pairs={[    ['Dashboard', '/dashboard'],
          ['Quizzes', '/quizzes'],
          ['Quiz Creation', '/quiz_creation']
        ]}
      />
      <div className='Contact-content'>
        <h4 className='Contact-header'>Contact</h4>
        <div className='Contact-body'>
          <p><VscLocation/> Adress: Splaiul Independentei 290, Bucharest, Romania</p>
          <p><AiOutlineMail/>  E-mail: quizzy@yahoo.com</p>
          <p><AiOutlinePhone/>  Phone: (+40)765 002 291</p>
        </div>
      </div>
      <Rating/>
    </div>
  )
}
