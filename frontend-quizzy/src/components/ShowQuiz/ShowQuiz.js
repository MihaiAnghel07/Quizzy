import React from 'react'
import './ShowQuiz.css'

function ShowQuiz(props) {

    // console.log(props.questions)
    let records = Object.values(props.questions);
    console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now()));
  return (
    <div>
        {records.map((row, index) => {
            // console.log(row)
            return (
                <div key={index}>
                    <div>Question: {row.question}</div>
                    <div>Ans1: {row.answer1.text}</div>
                    <div>Ans2: {row.answer2.text}</div>
                    <div>Ans3: {row.answer3.text}</div>
                    <div>Ans4: {row.answer4.text}</div>
                </div>
            )
        })}
    </div>
  )
  
}


export default ShowQuiz