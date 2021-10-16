import React, { useState } from 'react';
import { Round, RoundActions } from '../../../interfaces';
import OptionsMenu from '../views/OptionsMenu';
import TeamRoundPoints from '../views/TeamRoundPoints';

export interface Props {
  round: Round,
  teams: string[],
  onClickActions?: RoundActions[],
  selected: boolean,
  index: number
}

const RoundPoints: React.FC<Props> = ({ round, teams, onClickActions, selected, index }) => {
  const [menuAnchor, setMenuAnchor] = useState<{top: number, left: number}>();

  const wrapCallback = (callback: (index: number) => void) => {
    return () => {
      setMenuAnchor(undefined);
      callback(index);
    }
  }

  const click =(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuAnchor({left: e.pageX, top: e.pageY});
    window.addEventListener("mousedown", (ev) => {
      if((ev.target as any).id === "round-points") return;

      setMenuAnchor(undefined)
    }, {
      once: true
    })
  }

  return (
    <div 
      onClick={menuAnchor ? undefined : click}
      className={`grid grid-cols-${teams.length} border-primary ${selected ? "text-black" : "text-gray-300"} hover:bg-gray-100 bg-transparent text-xl font-medium`}
    >
      {teams.map(team => (
        <TeamRoundPoints 
          key={team} 
          points={round[team].points} 
          declarations={round[team].declarations} 
        />
      ))}
      {menuAnchor && 
        <OptionsMenu 
          position={menuAnchor} 
          onClickOptions={onClickActions?.map(
            action => ({...action, action: wrapCallback(action.action)})
          )}
        />
      }
    </div>
  );
};

export default RoundPoints;