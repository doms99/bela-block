import React from 'react';

export interface Props {
  winner: string,
  newGame: () => void,
  rematch: () => void,
  deleteLast: () => void
}

const Winner: React.FC<Props> = ({ winner, rematch, newGame, deleteLast }) => {
  return (
    <div className="absolute h-full w-full bg-white-transparent flex items-center justify-center z-50">
      <section className="content-box text-center text-white bg-primary p-6 w-3/4">
        <b className="text-2xl font-bold">{winner}</b><br/>
        <span className="text-lg font-normal" >win's this match</span>
        <div className="grid grid-cols-2 gap-2 mt-6">
          <button className="px-2 py-3 bg-white text-primary hover:text-primary-active rounded-full font-bold" onClick={rematch}>Rematch</button>
          <button className="px-2 py-3 bg-white text-primary hover:text-primary-active rounded-full font-bold" onClick={newGame}>New game</button>
          <button className="py-2 mx-12 font-normal hover:bg-primary-active rounded-full col-start-1 col-end-3" onClick={deleteLast}>Delete last</button>
        </div>
      </section>
    </div>
  );
};

export default Winner;