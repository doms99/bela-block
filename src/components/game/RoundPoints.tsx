import React, { useState } from 'react';
import { Round } from '../../App';
import TeamRoundPoints from './TeamRoundPoints';

export interface Props {
  round: Round,
  teams: string[],
  onClickOptions?: {name: string, action: () => void}[],
  selected: boolean
}

const RoundPoints: React.FC<Props> = ({ round, teams, onClickOptions, selected }) => {
  const [menuAnchor, setMenuAnchor] = useState<{top: number, left: number}>();

  const wrapCallback = (callback: () => void) => {
    return () => {
      setMenuAnchor(undefined);
      callback();
    }
  }

  const click =(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMenuAnchor({left: e.pageX, top: e.pageY});
    window.addEventListener("mousedown", (e) => {
      if((e.target as any).id === "round-points") return;

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
        <TeamRoundPoints key={team} points={round[team].points} declarations={round[team].declarations} />
      ))}
      {menuAnchor && (
        <ul
          style={{top: menuAnchor.top, left: menuAnchor.left}}
          className="rounded-md absolute pt-1 pb-1 pl-2 pr-2 z-20 bg-primary text-white text-left font-light text-md"
        >
          {onClickOptions?.map(action => (
            <li key={action.name}>
              <button id="round-points" onClick={wrapCallback(action.action)}>
                {action.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoundPoints;