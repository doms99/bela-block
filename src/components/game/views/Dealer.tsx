import React from 'react';
import CancelIcon from '../../icons/CancelIcon';
import EditIcon from '../../icons/EditIcon';

export interface Props {
  players: string[],
  dealer: string,  
  dealerEdit: boolean,

  setDealer: (player: string) => void,
  editModeToggle: () => void
}

const Dealer: React.FC<Props> = ({ players, dealer, setDealer, dealerEdit, editModeToggle }) => {
  return (
    <section className={`absolute text-center bottom-0 w-full grid grid-cols-${players.length}`}>
      {players.map((player) => (
        <button
          key={player}
          className={`font-bold text-2xl ${dealer === player || dealerEdit ? "text-black" : "text-primary-active"}`}
          onClick={() => setDealer(player)}
        >
          {player}
        </button>
        )
      )}
      <button 
        className={`rounded-b-none mt-2 rounded-t-full bg-primary w-16 h-8 col-start-${players.indexOf(dealer!)+1} m-auto`}
        onClick={editModeToggle}
      >
        {dealerEdit ? <CancelIcon className="w-3 m-auto mt-1" /> : <EditIcon className="w-3 m-auto mt-1" />}
      </button>
    </section>
  );
};

export default Dealer;