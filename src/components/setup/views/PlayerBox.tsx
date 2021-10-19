import React from 'react';
import Players1 from '../../icons/Players1';

export interface Props {
  name: string,
  playerNumber: number,
  playerCount: number,
  setName: (name: string) => void,
  error?: boolean,
}

const PlayerBox: React.FC<Props> = ({ name, setName, playerNumber, playerCount, error }) => {
  const hint = `Player ${playerNumber}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  return (
    <div className={`absolute flex justify-center items-center flex-col text-center w-32 h-32 rounded-full bg-primary player-${playerNumber}-${playerCount}-players`}>
      <Players1 className={`${error ? "text-error" : "text-white"} mb-2 h-6`} />
      <input
        type="text" 
        name={hint} 
        placeholder={hint} 
        value={name} 
        className="appearance-none rounded-xl p-1 border-transparent border-2 focus:border-white placeholder-white font-medium w-28 bg-transparent focus:outline-none text-white text-center"
        onChange={handleChange} 
      />
    </div>
  );
};

export default PlayerBox;