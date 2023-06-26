import React from 'react'
import { FaGithub } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import './Footer.css'

export default function Footer() {
  return (
    <div className='footer'>
      <ol className='footer-list'>
        <li className='footer-copyright'>Copyright &copy; 2023 Quizzy</li>
        <li className='footer-terms'>Terms</li>
        <li className='footer-github'><FaGithub /></li>
        <li className='footer-facebook'><FaFacebook /></li>
      </ol>
    </div>
  )
}
