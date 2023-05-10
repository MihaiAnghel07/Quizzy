import { useState } from 'react';
import './Rating.css';

function Rating(props) {
  const [rating, setRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
    props.setRatingHandler(value)
    // console.log("Rating: " + rating)
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index <= value - 1) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  };

  const handleMouseOver = (value) => {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index <= value - 1) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  };

  const handleMouseLeave = () => {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star) => {
      star.classList.remove('filled');
    });
    if (rating > 0) {
      stars.forEach((star, index) => {
        if (index <= rating - 1) {
          star.classList.add('filled');
        }
      });
    }
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={`star ${rating >= value ? 'filled' : ''}`}
          onClick={() => handleRatingClick(value)}
          onMouseOver={() => handleMouseOver(value)}
          onMouseLeave={handleMouseLeave}   
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default Rating;
