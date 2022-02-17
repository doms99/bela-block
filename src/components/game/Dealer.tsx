import React, { memo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../redux/hooks';
import { setDealer as dealerAction } from '../../redux/slices/gameSlice';
import CancelIcon from '../icons/CancelIcon';
import EditIcon from '../icons/EditIcon';
import Slider from '../Slider';

const Dealer: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const players = useSelector(state => state.game.players);
  const dealer = useSelector(state => state.game.dealer);
  const dispatch = useDispatch();

  const setDealer = useCallback((dealer: string) => {
    dispatch(dealerAction({dealer: dealer}));
    setEditMode(false);
  }, [dispatch]);

  const editModeToggle = useCallback(() => setEditMode(curr => !curr), []);

  return (
    <DealerView
      players={players}
      dealer={dealer}
      editMode={editMode}

      setDealer={setDealer}
      editModeToggle={editModeToggle}
    />
  );
};

export default Dealer;

export interface ViewProps {
  players: string[],
  dealer: string,
  editMode: boolean,

  setDealer: (player: string) => void,
  editModeToggle: () => void
}

export const DealerView: React.FC<ViewProps> = memo(({ players, dealer, setDealer, editMode, editModeToggle }) => {
  return (
    <section className={`text-center z-10`}>
      <div className={`w-full grid grid-cols-${players.length}`}>
        {players.map((player) => (
          <button
            key={player}
            className={`font-bold text-2xl ${dealer === player || editMode ? "text-black" : "text-primary-active"}`}
            onClick={() => setDealer(player)}
          >
            {player}
          </button>
        ))}
      </div>
      <Slider divisions={players.length} value={players.indexOf(dealer)+1}>
        <button
          className={`rounded-indicator bg-primary col-start-${players.indexOf(dealer!)+1}`}
          onClick={editModeToggle}
        >
          {editMode ? <CancelIcon className="w-3 m-auto mt-1 text-white" /> : <EditIcon className="w-2 m-auto mt-1 text-white" />}
        </button>
      </Slider>
    </section>
  );
});