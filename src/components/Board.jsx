import React from 'react';
import Square from './Square';
import Player from './Player';

const Board = ({board, player, updatePlayerCoordinates, updatePlayerScore, updateBoard}) => {
  const rows = board.map((item, i) => {
    return <div key={i} className='row'><Square square={item} /></div>
  });
  return (
    <div className='board'>
      <Player
        player={player}
        board={board}
        updatePlayerCoordinates={updatePlayerCoordinates}
        updatePlayerScore={updatePlayerScore}
        updateBoard={updateBoard}
      />
      {rows}
    </div>
  );
};

export default Board;
