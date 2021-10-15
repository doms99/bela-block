import React, { CSSProperties, useContext, useState } from 'react';
import "../../styles/Setup.css";
import SittingOrder from './SittingOrder';
import { GlobalState } from '../../App';
import { useHistory } from 'react-router';

const verticalFlex: CSSProperties = {
  display:' flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const PlayersSetup = () => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [scoreTarget, setScoreTarget] = useState<number>(1001);
  const history = useHistory();
  const { startGame } = useContext(GlobalState);

  const handlePlayerCount = (event: React.MouseEvent<HTMLElement>, newPlayerCount: number | null) => {
    if(!newPlayerCount) return;

    setPlayerCount(newPlayerCount);
  };

  const handleScoreTarget = (event: React.MouseEvent<HTMLElement>, scoreTarget: number | null) => {
    if(!scoreTarget) return;

    setScoreTarget(scoreTarget);
  };

  const nameReport = (names: string[]) => {
    startGame(names, scoreTarget);
    history.push('/game');
  }

  return (
    <main style={verticalFlex}>
      <div
        // size="large"
        // value={playerCount}
        // exclusive
        // onChange={handlePlayerCount}
        // aria-label="player count"
      >
        <button value={2} aria-label="left aligned">
          <div>
            
            <span>2 players</span>
          </div>
        </button>
        <button value={3} aria-label="centered">
          <div>
            
            <span>3 players</span>
          </div>
        </button>
        <button value={4} aria-label="right aligned">
          <div>
            
            <span>4 players</span>
          </div>
        </button>
      </div>
      <hr style={{width: '100%', margin: '0.5em 0'}} />
      <div
        // size="large"
        // value={scoreTarget}
        // exclusive
        // onChange={handleScoreTarget}
        // aria-label="score target"
      >
        <button value={501} aria-label="right aligned">
          501
        </button>
        <button value={701} aria-label="right aligned">
          701
        </button>
        <button value={1001} aria-label="right aligned">
          1001
        </button>
      </div>
      <hr style={{width: '100%', margin: '0.5em 0'}} />
      <SittingOrder playerCount={playerCount} nameReport={nameReport} />
    </main>
  );
};

export default PlayersSetup;