import React from "react";
import '../styles/paginateButton.css';

const resolveText = (activeTab, page) => {
  if (['Ships', 'Weapons', 'Items'].includes(activeTab)) {
    return page === 1 ? 'Next' : 'Previous';
  } else {
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
