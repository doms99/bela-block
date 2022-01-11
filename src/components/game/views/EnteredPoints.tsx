import React from 'react';
import { Sugestion } from '../../../interfaces';

export interface Props {
  points: number,
  declarations: number,
  bonus: Boolean,
  selected: 'points' | 'declarations' | undefined,
  setSelected: (value: 'points' | 'declarations') => void,
  sugestion?: Sugestion
}

const EnteredPoints: React.FC<Props> = ({ points, declarations, bonus, selected, setSelected, sugestion }) => {
  return (
    <div className={`text-center relative w-full text-${selected ? "white" : "primary-active"}`}>
      <button onClick={() => setSelected('points')} className={`${selected === 'points' ? "underline " : ""}font-extrabold text-4xl mb-2`}>
        {points}
      </button>
      <br/>
      <button onClick={() => setSelected('declarations')} className={`${selected === 'declarations' ? "underline " : ""}font-medium text-md`}>
        {declarations}
      </button>      
      {sugestion && (
        <button 
          className={`absolute -right-6 rounded-md w-2/4 bg-transparent ${bonus ? 'text-white' : 'text-primary-active'} text-center font-bold`}
          onClick={sugestion.callback}
        >
          {sugestion.text}
        </button>
      )}
    </div>
  );
};

export default EnteredPoints;