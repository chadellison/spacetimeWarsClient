import React from "react";
import '../styles/paginateButton.css';

export const PaginateButton = ({updateState, page}) => {
  return (
    <div className="paginateButton" onClick={() => updateState({page: page === 1 ? 2 : 1})}>
      {page === 1 ? 'Next' : 'Previous'}
    </div>
  );
};
