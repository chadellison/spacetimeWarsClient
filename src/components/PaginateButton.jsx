import React from "react";
import '../styles/paginateButton.css';

const resolveText = (activeTab, page) => {
  switch (activeTab) {
    case 'Ships':
      return page === 1 ? 'Next' : 'Previous';
    case 'Weapons':
      return page === 1 ? 'Next' : 'Previous';
    default:
      return null;
  }
}

export const PaginateButton = ({updateState, page, activeTab}) => {
  return (
    <div className="paginateButton" onClick={() => updateState({page: page === 1 ? 2 : 1})}>
      {resolveText(activeTab, page)}
    </div>
  );
};
