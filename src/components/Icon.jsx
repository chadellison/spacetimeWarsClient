import React from 'react';
import '../styles/icon.css';

export const Icon = ({onClick, src, alt}) => {
  return (
    <div className="navIcon" onClick={onClick}>
      <img src={src} alt={alt} className="navIconImage" />
    </div>
  );
};
