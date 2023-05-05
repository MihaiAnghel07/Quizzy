import React, { useEffect } from "react";
import "./Popup.css";

function Popup(props) {
  const { message, duration, position } = props;

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
      <span>{message}</span>
    </div>
  );
}

export default Popup;
