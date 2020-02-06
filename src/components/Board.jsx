import React from 'react';
import Square from './Square';
import Player from './Player';

const Board = ({board, player, updatePlayerCoordinates, updateGameState}) => {
  const rows = board.map((item, i) => {
    return <div key={i} className='row'><Square square={item} /></div>
  });
  return (
    <div className='board'>
      <Player
        player={player}
        board={board}
        updatePlayerCoordinates={updatePlayerCoordinates}
        updateGameState={updateGameState}
      />
      {rows}
    </div>
  );
};

export default Board;
