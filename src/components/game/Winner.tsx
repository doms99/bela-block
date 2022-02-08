import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from '../../redux/hooks';
import { deleteRound, reset, restart } from '../../redux/slices/gameSlice';
import GameWrapper from './GameWrapper';


const Winner: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const lastIndex = useSelector(state => state.game.rounds!.length-1);
  const winner = useSelector(state => state.game.winner);

  const newGame = useCallback(() => {
    dispatch(reset());
    history.push('/setup');
  }, [history, dispatch]);

  const rematch = useCallback(() => {
    dispatch(restart());
  }, [dispatch]);

  const deleteLast = useCallback(() => {
    dispatch(deleteRound({index: lastIndex}))
  }, [dispatch, lastIndex]);

  return (
    <WinnerView
      deleteLast={deleteLast}
      rematch={rematch}
      newGame={newGame}
      winner={winner}
    />
  );
};

export default Winner;

export type ViewProps = {
  winner?: string,
  rematch: () => void,
  newGame: () => void,
  deleteLast: () => void
}

export const WinnerView: React.FC<ViewProps> = memo(({ winner, rematch, newGame, deleteLast }) => {
  return (
    <GameWrapper>
      <section className="content-box text-center text-white bg-primary p-6 m-auto">
        <b className="text-2xl font-bold">{winner}</b><br/>
        <span className="text-lg font-normal" >win's this match</span>
        <div className="grid grid-cols-2 gap-2 mt-6">
          <button className="px-2 py-3 bg-white text-primary hover:text-primary-active rounded-full font-bold" onClick={rematch}>Rematch</button>
          <button className="px-2 py-3 bg-white text-primary hover:text-primary-active rounded-full font-bold" onClick={newGame}>New game</button>
          <button className="py-2 mx-12 font-normal hover:bg-primary-active rounded-full col-start-1 col-end-3" onClick={deleteLast}>Delete last</button>
        </div>
      </section>
    </GameWrapper>
  );
});