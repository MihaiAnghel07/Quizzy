import React from "react";


export function DropDown({
  toggleDropdown,
  isPublic,
  isOpen,
  handleOptionClick
}) {
  return <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
          Visibility: {isPublic ? 'Public' : 'Private'}
      </button>
      {isOpen && <div className="dropdown-menu">
          {this.props.options.map(option => <div key={option.value} className="dropdown-item" onClick={() => handleOptionClick(option)}>
              {option.label}
              </div>)}
          </div>}
  </div>;
}
  