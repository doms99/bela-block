import React, { useCallback, useEffect, useRef } from 'react';
import { PlayersError } from './PlayersSetup';
import PlayerBox from './PlayerBox';
import { useSprings, animated } from '@react-spring/web';

export interface Props {
  playerNames: string[],
  numberOfPlayers: number,
  errors: PlayersError,

  setName: (name: string, index: number) => void,
}

const position = [
  [
    { top: '100%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 },
    { top: '0', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 },
  ],
  [
    { top: '100%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 },
    { top: '0', left: '100%', transform: 'translate(-66%, 33%)', opacity: 1 },
    { top: '0', left: '0', transform: 'translate(-33%, 33%)', opacity: 1 },
  ],
  [
    { top: '100%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 },
    { top: '50%', left: '100%', transform: 'translate(-50%, -50%)', opacity: 1 },
    { top: '0', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 },
    { top: '50%', left: '0', transform: 'translate(-50%, -50%)', opacity: 1 }
  ]
];

const middle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 };

const SittingOrder: React.FC<Props> = ({ playerNames, numberOfPlayers, setName, errors }) => {
  const prevVal = useRef(numberOfPlayers);
  const [props, animate] = useSprings(4, index => position[numberOfPlayers-2][index]);

  useEffect(() => {
    if(prevVal.current === numberOfPlayers) return;

    animate.start(index => {
      if (index + 1 <= numberOfPlayers) {
        return {
          from: position[prevVal.current-2][index],
          to: position[numberOfPlayers-2][index]
        };
      }

      return {
        from: position[prevVal.current-2][index],
        to: middle
      };
    });

    prevVal.current = numberOfPlayers;
  }, [numberOfPlayers, animate]);

  const handleSetName = useCallback((name: string, playerNum: number) => {
    setName(name, playerNum-1);
  }, [setName]);

  return (
    <div className="relative w-2/3 h-4/5 m-auto border-8 rounded-full border-white">
      {playerNames.map((name, index) => (
        <animated.div style={props[index]} key={index} className={`absolute`}>
          <PlayerBox
            name={name}
            playerNumber={index+1}
            setName={handleSetName}
            error={!!errors[index]}
          />
        </animated.div>
      ))}
    </div>
  );
};

export default SittingOrder;