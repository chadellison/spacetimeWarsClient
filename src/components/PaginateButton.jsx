import React from "react";
import '../styles/paginateButton.css';

const resolveButton = (activeTab, page, buttonType, updateState) => {
  const handleClick = (disabled, newPage) => {
    if (!disabled) {
      updateState({ page: newPage})
    }
  }

  const lastPage = activeTab === 'Ships' ? 2 : 3;
  if (buttonType === 'left') {
    return <div className={page === 1 ? 'disabledButton' : 'paginateButton'} onClick={() => handleClick(page === 1, page - 1)}>{"<"}</div>
  } else if (buttonType === 'right') {
    return <div className={page === lastPage ? 'disabledButton' : 'paginateButton'} onClick={() => handleClick(page === lastPage, page + 1)}>{">"}</div>
  }
}

export const PaginateButton = ({ updateState, page, activeTab }) => {
  return (
    <div>
      {resolveButton(activeTab, page, 'left', updateState)}
      <span className="page">{page}</span>
      {resolveButton(activeTab, page, 'right', updateState)}
    </div>
  );
};
