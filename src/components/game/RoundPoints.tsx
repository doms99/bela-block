import React, { memo, useState } from 'react';
import { bonusPoints } from '../../constants';
import { Round, RoundActions } from '../../interfaces';
import Dots from '../icons/Dots';
import OptionsMenu from './OptionsMenu';
import TeamRoundPoints from './TeamRoundPoints';

export interface Props {
  round: Round,
  teams: string[],
  onClickActions?: RoundActions[],
  selected: boolean,
  index: number
}

const RoundPoints: React.FC<Props> = ({ round, teams, onClickActions, selected, index }) => {
  const [clicked, setClicked] = useState<boolean>(false);

  const wrapCallback = (callback: (index: number) => void) => {
    return () => {
      setClicked(false);
      callback(index);
    }
  }

  const click =(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setClicked(curr => !curr);
  }

  return (
    <div
      className={`group relative grid grid-cols-${teams.length}
      px-5 border-primary ${selected ? "text-black" : "text-gray-400"}
      hover:bg-gray-100 bg-transparent text-xl font-medium`}
    >
      <button
        onClick={click}
        className="hidden group-hover:block active:bg-gray-200 absolute left-0 ml-2 h-full px-2 rounded-md" >
        <Dots/>
      </button>
      {teams.map(team => (
        <TeamRoundPoints
          key={team}
          points={round[team].points}
          declarations={round[team].declarations + (round[team].bonus ? bonusPoints : 0)}
        />
      ))}
      {(clicked && !!onClickActions) && (
        <div className="col-span-2">
          <OptionsMenu
            onClickOptions={onClickActions.map(
              action => ({...action, action: wrapCallback(action.action)})
            )}
          />
        </div>
      )}
    </div>
  );
};

export default memo(RoundPoints);