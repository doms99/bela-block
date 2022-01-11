import React, { useRef, useState } from 'react';
import { Round, RoundActions } from '../../../interfaces';
import Dots from '../../icons/Dots';
import TeamRoundPoints from '../views/TeamRoundPoints';

export interface Props {
  round: Round,
  teams: string[],
  onClickActions?: RoundActions[],
  selected: boolean,
  index: number
}

const RoundPoints: React.FC<Props> = ({ round, teams, onClickActions, selected, index }) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const setMinWidth = () => {
    if(rowRef.current === null) {
      setTimeout(setMinWidth, 0);
      return;
    }

    rowRef.current!.style.minWidth = rowRef.current!.style.width;
  }

  setTimeout(setMinWidth, 0);

  const wrapCallback = (callback: (index: number) => void) => {
    return () => {
      setClicked(false);
      callback(index);
    }
  }

  const click =(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setClicked(true);
    window.addEventListener("mousedown", () => {
      setClicked(false)
    }, {
      once: true
    });
    window.addEventListener("touchstart", () => {
      setClicked(false)
    }, {
      once: true
    })
  }

  return (
    <div 
      className={`group relative px-5 border-primary
      ${selected ? "text-black" : "text-gray-400"}
      hover:bg-gray-100 bg-transparent text-xl font-medium`}
    > 
      {clicked && (
        <>
          <span className="bg-yellow-500">E</span>
          <span className="bg-blue-400">R</span>
          <span className="bg-red-500">D</span>
        </>
      )}
      <button 
        onClick={click}
        className="hidden group-hover:block active:bg-gray-200 absolute left-0 ml-2 h-full px-2 rounded-md" >
        <Dots/>
      </button>
      <div ref={rowRef} className="inline-block min-w-full">
        <div className={`grid grid-cols-${teams.length}`}>
          {teams.map(team => (
            <TeamRoundPoints
              key={team}
              points={round[team].points}
              declarations={round[team].declarations}
            />
          ))}
        </div>
      </div>
      {/* {clicked && 
        <div className="absolute left-0 bottom-0 ml-2 transform translate-y-full z-50">
          <OptionsMenu
            onClickOptions={onClickActions?.map(
              action => ({...action, action: wrapCallback(action.action)})
            )}
          />
        </div>
      } */}
    </div>
  );
};

export default RoundPoints;