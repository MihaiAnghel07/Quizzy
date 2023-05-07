import React from 'react'
import { useState } from 'react';
import './Faq.css'

import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai'

const Faq = () => {
  const [expandedId, setExpandedId] = useState(null);

  const handleFaqClick = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="faq-wrapper">
      <div className="faq-item">
        <div className="faq-question" onClick={() => handleFaqClick(1)}>
          {expandedId === 1 && <AiOutlineUp/>}
          {expandedId != 1 && <AiOutlineDown/>}
            Question 1
          </div>
        {expandedId === 1 && (
          <div className="faq-answer">
            Answer to question 1.
          </div>
        )}
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={() => handleFaqClick(2)}>
          {expandedId === 2 && <AiOutlineUp/>}
          {expandedId != 2 && <AiOutlineDown/>}
          Question 2
          </div>
        {expandedId === 2 && (
          <div className="faq-answer">
            Answer to question 2.
          </div>
        )}
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={() => handleFaqClick(3)}>
          {expandedId === 3 && <AiOutlineUp/>}
          {expandedId != 3 && <AiOutlineDown/>}
          Question 3
        </div>
        {expandedId === 3 && (
          <div className="faq-answer">
            Answer to question 3.
          </div>
        )}
      </div>

      <div className="faq-item">
        <div className="faq-question" onClick={() => handleFaqClick(4)}>
          {expandedId === 4 && <AiOutlineUp/>}
          {expandedId != 4 && <AiOutlineDown/>}
          Question 4
        </div>
        {expandedId === 4 && (
          <div className="faq-answer">
            Answer to question 4.
            
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
  )
}

export default Faq