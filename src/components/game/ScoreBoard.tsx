import React, { memo, useCallback, useMemo, useState } from 'react';
import { Round, RoundActions } from '../../interfaces';
import { useDispatch, useSelector } from '../../redux/hooks';
import { deleteRound } from '../../redux/slices/gameSlice';
import AddIcon from '../icons/AddIcon';
import RoundPoints from './RoundPoints';
import TotalPoints from './TotalPoints';
import { useHistory } from 'react-router-dom';


const ScoreBoard: React.FC = () => {
  const rounds = useSelector(state => state.game.rounds);
  const teams = useSelector(state => state.game.teams);
  const scoreTarget = useSelector(state => state.game.scoreTarget);
  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedRound, setSelectedRound] = useState<number>(rounds.length - 1);

  const roundActions = useMemo(() => [
    {name: 'Edit', action: (index: number) => history.replace(`/game/round/${index}`)},
    {name: 'Rewind', action: (index: number) => setSelectedRound(index)},
    {name: 'Delete', action: (index: number) => dispatch(deleteRound({index}))}
  ], [dispatch, history]);

  const addNewCallback = useCallback(() => history.replace('/game/round'), [history]);

  return (
    <ScoreBoardView
      lastSumIndex={selectedRound}
      roundActions={roundActions}
      rounds={rounds}
      scoreTarget={scoreTarget}
      addNewCallback={addNewCallback}
      teams={teams}
    />
  );
};

export default ScoreBoard;

export const sumOfPoints = (points: number[], declarations: number[]) => {
  return points.reduce((acc, curr) => acc + curr, 0) + declarations.reduce((acc, curr) => acc + curr, 0);
}

export interface ViewProps {
  rounds: Round[],
  teams: string[],
  lastSumIndex: number,
  scoreTarget: number,
  roundActions: RoundActions[],

  addNewCallback: () => void
}

export const ScoreBoardView: React.FC<ViewProps> = memo(({ teams, roundActions, scoreTarget, rounds, addNewCallback, lastSumIndex }) => {
  return (
    <>
      <section className={`grid grid-cols-${teams.length} mx-6 mb-8`}>
        {teams.map(name => (
          <TotalPoints
            key={name}
            points={rounds.slice(0, lastSumIndex+1).reduce(
              (sum, round) => sum + round[name].declarations + round[name].points, 0)
            }
            scoreTarget={scoreTarget}
          />
        ))}
      </section>
      <section className="content-box bg-white relative h-full overflow-x-hidden py-4 pb-14 mx-6">
        <div className="overflow-y-auto overflow-x-hidden h-full">
          {[...rounds].reverse().map((round, i) => {
            const index = rounds.length - 1 - i;
            return <RoundPoints
              key={index}
              onClickActions={roundActions}
              round={round}
              teams={teams}
              selected={index <= lastSumIndex}
              index={index}
            />
          })}
        </div>
        {/* <div className="absolute bottom-0 w-full h-1/6 mb-14 bg-gradient-to-t from-white" /> */}
      </section>
      <div className="text-right px-16 sm:px-28 transition-all -mt-12 w-full z-30">
          <button
            className="w-24 h-24 outlined-bnt
                     text-primary hover:text-primary-active"
            onClick={addNewCallback}
          >
            <AddIcon className="w-4/6 m-auto" />
          </button>
      </div>
    </>
  );
});