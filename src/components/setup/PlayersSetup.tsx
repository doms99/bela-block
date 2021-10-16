import React, { useContext, useState } from 'react';
import SittingOrder from './SittingOrder';
import { GlobalState } from '../../App';
import { useHistory } from 'react-router';
import NumberOfPLayers from './views/NumberOfPLayers';
import ConfirmIcon from '../icons/ConfirmIcon';
import Border4 from '../icons/Border4';

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
    <div className="text-right text-white overflow-x-hidden">
      <main className="green-backdrop pb-12 pt-4">
        <div className="h-65vh w-full relative">
          <Border4 className="absolute w-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <div className=" text-center grid grid-cols-3 grid-rows-3 w-80 h-full bg-red-700 m-auto">
            <div className="col-start-2 row-start-3">1</div>
            <div className="col-start-3 row-start-2">2</div>
            <div className="col-start-2 row-start-1">3</div>
            <div className="col-start-1 row-start-2">4</div>
          </div>
        </div>
      </main>
      <div className="w-full -mt-12 h-24 flex justify-between">
        <div className="placeholder" />
        <div className="mr-28 w-24 h-24">
          <button
            className="outlined-bnt-flipped text-white hover:text-white-active"
          >
            <ConfirmIcon className="w-4/6 m-auto" />
          </button>
        </div>
      </div>
      <NumberOfPLayers 
        value={playerCount}
        setValue={(num: number) => setPlayerCount(num)}
      />
    {/* <div>
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
      <div>
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
      <SittingOrder playerCount={playerCount} nameReport={nameReport} /> */}
      <NumberOfPLayers 
        value={playerCount}
        setValue={(num: number) => setPlayerCount(num)}
      />
    </div>
  );
};

export default PlayersSetup;