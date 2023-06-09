import React from 'react'
import { useState } from 'react';
import './Faq.css'

import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai'
import NavigationComponent from '../../components/NavigationComponent/NavigationComponent';

const Faq = () => {
  const [expandedId, setExpandedId] = useState(null);
  localStorage.setItem("selectedButton", "faq");
  
  const handleFaqClick = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div>
      {/* <div className='faq-navigation-component'>
        <NavigationComponent
            pageTitle="FAQ"
            pairs={[]}
        />
      </div>   */}

      <h2 className='faq-title'>Frequently Asked Questions</h2>
    
      <div className="faq-wrapper">
        <div className="faq-item">
          <div className="faq-question" onClick={() => handleFaqClick(1)}>
            {expandedId === 1 && <AiOutlineUp/>}
            {expandedId != 1 && <AiOutlineDown/>}
              How do I create a set of questions?
            </div>
          {expandedId === 1 && (
            <div className="faq-answer">
              In order to create a set of questions, you need to follow the steps:

              <ol className='faq-q1-list'>
                <li>From Dashboard, click on "Question Sets"</li>
                <li>In "Question Sets" page, you will find "Create Question Set" button. Click on it.</li>
                <li>Now, you can define your own question set. You can add images & text for each question, 
                  you can set the question set visibility:</li>
                  <ul>
                    <li><b>private:</b> only you will be able to use this set for quizzes</li>
                    <li><b>public:</b> other people will see the set content and they will be able to use the set for their own quizzes</li>
                  </ul>
              </ol>
              
            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => handleFaqClick(2)}>
            {expandedId === 2 && <AiOutlineUp/>}
            {expandedId != 2 && <AiOutlineDown/>}
            How do I edit / delete a set of questions?
            </div>
          {expandedId === 2 && (
            <div className="faq-answer">
              In order to edit / delete a set of questions, you need to follow the steps:

              <ol className='faq-q1-list'>
                <li>From Dashboard, click on "Question Sets"</li>
                <li>In "Question Sets" page, you will find both your own question sets and all public ones (switch pages by 
                    <b>'My Question Sets'</b> / <b>'All Question Sets'</b> ).</li>
                <li>The list from page has a menu called "Options" and for each item (question set) there are 2 buttons: <b>Edit</b> / <b>Delete</b></li>
                <li>From 'Edit Set' page you can perform the following:</li>
                <ul>
                  <li>Edit question set title</li>
                  <li>Edit question set visibility</li>
                  <li>Add / delete / edit questions</li>
                </ul>
              </ol>

            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => handleFaqClick(3)}>
            {expandedId === 3 && <AiOutlineUp/>}
            {expandedId != 3 && <AiOutlineDown/>}
            What does the 'copy' button actually do?

          </div>
          {expandedId === 3 && (
            <div className="faq-answer">
              The 'copy' button lets you copy a public questions set to your portofolio. 
            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => handleFaqClick(4)}>
            {expandedId === 4 && <AiOutlineUp/>}
            {expandedId != 4 && <AiOutlineDown/>}
            How do I start a quiz?

          </div>
          {expandedId === 4 && (
            <div className="faq-answer">
              For starting a quiz, you need to follow the steps:

              <ol className='faq-q1-list'>
                <li>From Dashboard, click on <b>'Create Lobby'</b></li>
                <li>There you will find a generated 'lobby code'. This code you must share with the quiz participants</li>
                <li>Select the questions set you want to use by selecting <b>'Select Question Set'</b> (you can choose between your own sets or public ones)</li>
                <li>Finally, after all participants have joined the lobby, click on <b>'Start Quiz'</b></li>
              </ol>
              
            </div>
          )}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => handleFaqClick(5)}>
            {expandedId === 5 && <AiOutlineUp/>}
            {expandedId != 5 && <AiOutlineDown/>}
            Question 5
          </div>
          {expandedId === 5 && (
            <div className="faq-answer">
              Answer to question 5.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Faq