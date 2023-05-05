import React from 'react'
import { FaGithub } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import './Footer.css'

export default function Footer() {
  return (
    <div className='footer'>
        <p className='footer-copyright'>Copyright &copy; 2023 Quizzy</p>
        <label className='footer-terms'>Terms</label>
        <label className='footer-github'><FaGithub /></label>
        <label className='footer-facebook'><FaFacebook /></label>
    </div>
  )
}
