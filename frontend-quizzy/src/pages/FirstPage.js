import React from 'react'

export default function FirstPage(props) {
  // if (props.name !== 'lala') {
  //   return null;
  // }
  return (
    <div className="FirstPage">
        <h1>Hello {props.name} from FirstPage!</h1> 
    </div>
  )
}
