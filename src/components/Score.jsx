import React from "react";
import '../styles/score.css';

export const Score = ({score}) => {
  return (
    <div className="score">{`${score.name}: ${score.score}`}</div>
  );
};
