import React from 'react';

export interface Props {
  winner: string,
  newGame: () => void,
  rematch: () => void
}

const Winner: React.FC<Props> = ({ winner, rematch, newGame }) => {
  return (
    <div className="before">
      <section className="absolute-card">
        <div>
          <span><b>{winner}</b> won this match</span>
        </div>
        <div style={{justifyContent: 'space-around'}}>
          <button onClick={rematch}>Rematch</button>
          <button onClick={newGame}>New game</button>
        </div>
      </section>
    </div>
  );
};

export default Winner;