import React, { useCallback } from 'react';
import { PlayersError } from '../../../interfaces';
import PlayerBox from './PlayerBox';

export interface Props {
  playerNames: string[],
  setName: (name: string, index: number) => void,
  error?: PlayersError
}

const SittingOrder: React.FC<Props> = ({ playerNames, setName, error }) => {
  const handleSetName = useCallback((name: string, playerNum: number) => {
    setName(name, playerNum-1);
  }, [setName]);

  return (
    <div className="relative w-2/3 h-4/5 m-auto border-8 rounded-full border-white">
      {playerNames.map((name, index) => (
        <div className={`absolute player-${index + 1}-${playerNames.length}-players`}>
          <PlayerBox
            key={index}
            name={name}
            playerNumber={index+1}
            setName={handleSetName}
            error={error?.sources.includes(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default SittingOrder;