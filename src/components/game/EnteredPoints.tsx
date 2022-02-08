import React, { memo } from 'react';
import { Sugestion } from '../../interfaces';

export interface Props {
  points: number,
  declarations: number,
  bonus: Boolean,
  selected: 'points' | 'declarations' | undefined,
  setSelected: (team: string, value: 'points' | 'declarations') => void,
  sugestion?: Sugestion,
  team: string
}

const EnteredPoints: React.FC<Props> = ({ points, declarations, bonus, selected, setSelected, sugestion, team }) => {
  return (
    <div className={`text-center relative w-full text-${selected ? "white" : "primary-active"}`}>
      <button onClick={() => setSelected(team, 'points')} className={`${selected === 'points' ? "underline " : ""}font-extrabold text-4xl mb-2`}>
        {points}
      </button>
      <br/>
      <button onClick={() => setSelected(team, 'declarations')} className={`${selected === 'declarations' ? "underline " : ""}font-medium text-md`}>
        {declarations}
      </button>
      {sugestion && (
        <button
          className={`absolute -right-4 top-0 w-1/4 ${bonus ? 'text-white' : 'text-primary-active'} text-center font-bold`}
          onClick={sugestion.callback}
        >
          {sugestion.text}
        </button>
      )}
    </div>
  );
};

export default memo(EnteredPoints);