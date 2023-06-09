import React from 'react'
import './NavigationComponent.css'

import { useNavigate } from 'react-router-dom';

function NavigationComponent({pageTitle, pairs }) {
  const navigate = useNavigate();

  function handleNavigationItemClick(link) {
    if (pairs[pairs.length - 1][1] !== link) {
      if (link == "/update_quiz") {
        // singurul caz in care trebuie sa trimitem date pentru incarcarea paginii
        navigate(link, {state:{quizId:sessionStorage.getItem("updateQuizId"), 
                              quizAuthor:sessionStorage.getItem("updateQuizAuthor"), 
                              isPublic:sessionStorage.getItem("updateIsPublic"), 
                              quizTitle:sessionStorage.getItem("updateQuizTitle")}});
        sessionStorage.removeItem("updateQuizId");
        sessionStorage.removeItem("updateIsPublic");
        sessionStorage.removeItem("updateQuizTitle");
        sessionStorage.removeItem("updateQuizAuthor");

      } else {
        navigate(link);
      }
    }
  }

  function handleBackClick() {
    navigate(-1);
  }

  return (
    <div className="navigation-wrapper">
        <div className='navigation-page-items'>
            {pairs && pairs.map((pair, index) => (
                <React.Fragment key={index}>
                <span className="navigation-item" onClick={() => handleNavigationItemClick(pair[1])}>
                    {pair[0]}
                </span>
                {index !== pairs.length - 1 && <span className="item-divider">{'/'}</span>}
                </React.Fragment>
            ))}
        </div>

        {/* <div className='navigation-page-title'>{pageTitle}</div> */}
        
        {/* <div className='navigation-back-item'>
            {pairs && <span className="navigation-item" onClick={handleBackClick}>
                &lt; Back
            </span>}
        </div> */}
    </div>
  );
}

export default NavigationComponent;
