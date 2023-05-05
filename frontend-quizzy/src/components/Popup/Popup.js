import React, { useEffect } from "react";
import "./Popup.css";


function Popup(props) {
  const { message, duration, position, icon} = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      props.onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, props]);

  return (
    <div className={`popup ${position}`}>
        <div className="popup-container">
            <div className="popup-message">
                <span>{message}</span>
            </div>
            <div className="popup-icon">
                {icon}
            </div>
        </div>
    </div>
  );
}

export default Popup;
