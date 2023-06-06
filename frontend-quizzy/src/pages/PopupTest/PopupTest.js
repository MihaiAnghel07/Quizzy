import React, { useState } from "react";
import Popup from "../../components/Popup/Popup";
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa'

function PopupTest() {
  const [showPopup, setShowPopup] = useState(false);

  function handleButtonClick() {
    setShowPopup(true);
  }

  function handlePopupClose() {
    setShowPopup(false);
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Show Popup</button>
      {showPopup && (
        <Popup
          message="This is a Popup message."
          duration={2000}
          position="bottom-right"
          icon = {<FaCheck className='flag-button' style={{color:"rgb(232, 173, 64)"}}/>}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}

export default PopupTest;
