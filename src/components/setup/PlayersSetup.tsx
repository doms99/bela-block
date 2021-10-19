import React, { useCallback, useContext, useEffect, useState } from 'react';
import SittingOrder from './SittingOrder';
import { GlobalState } from '../../App';
import { useHistory } from 'react-router';
import NumberOfPLayers from './views/NumberOfPLayers';
import ConfirmIcon from '../icons/ConfirmIcon';
import { PlayersError } from '../../interfaces';

const PlayersSetup = () => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [scoreTarget, setScoreTarget] = useState<number>(1001);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<PlayersError>();
  const [startTried, setStartTried] = useState<boolean>(false);
  const history = useHistory();
  const { startGame } = useContext(GlobalState);

  const validateNames = useCallback((): PlayersError | undefined => {
    const current = playerNames.slice(0, playerCount);

    const nonEntered = current.map((name, index) => ({name, index})).filter(obj => obj.name.trim() === "").map(obj => obj.index);
    if(nonEntered.length !== 0) return {text: "All names must be entered", sources: nonEntered};

    const sameNames: number[] = [];

    for(const [index, name] of current.entries()) {
      if(sameNames.includes(index)) continue;

      const first = current.indexOf(name.trim());
      const last = current.lastIndexOf(name.trim());
      if(first === last) continue;

      sameNames.push(first);
      sameNames.push(last);
    }
    

    if(sameNames.length !== 0) {
      return {text: "Names must be unique", sources: sameNames};
    }

    return;
  }, [playerNames, playerCount]);

  const updateError = useCallback(() => {
    if(!startTried) return;

    setError(validateNames());
  }, [startTried, validateNames]);

  useEffect(() => {
    updateError();
  }, [updateError]);

  const handlePlayerCount = (newPlayerCount: number) => {
    setPlayerCount(newPlayerCount);
    setScoreTarget(newPlayerCount === 4 ? 1001 : newPlayerCount === 3 ? 701 : 501);
  };

  const start = () => {
    setStartTried(true);
    if(!startTried || !!error) return;

    startGame(playerNames, scoreTarget);
    history.push('/game');
  }

  const handleNameChange = (name: string, index: number) => {
    setPlayerNames(curr => {
      const newPlayerNames = [...curr];
      newPlayerNames[index] = name;

      return newPlayerNames;
    })
  }

  // const submit = () => {
  //   const slice = players.slice(0, playerCount);

  //   if(slice.map(player => player.name).filter(name => name === '').length) {
  //     setError("All names must be entered")
  //     return;
  //   }

  //   if(slice.map(player => player.name).filter((name) => {
  //     const mapped = slice.map(p => p.name);
  //     return mapped.indexOf(name) !== mapped.lastIndexOf(name);
  //   }).length) {
  //     setError("All names must be unique");
  //     return;
  //   }

  //   if(error) setError(undefined);

  //   nameReport(players.slice(0, playerCount).map(player => player.name));
  // }

  return (
    <div className="text-right text-white overflow-x-hidden">
      <main className="green-backdrop pb-12 pt-4">
        <div className="h-65vh w-full pt-12">
          <SittingOrder 
            playerCount={playerCount}
            playerNames={playerNames}
            setName={handleNameChange}
            error={error}
          />
        </div>
      </main>
      <div className="w-full -mt-12 h-24 flex justify-between">
        <div className="placeholder" />
        <div className="mr-28 w-24 h-24">
          <button
            className="outlined-bnt-flipped text-white hover:text-white-active"
            onClick={start}
          >
            <ConfirmIcon className="w-4/6 m-auto" />
          </button>
        </div>
      </div>
      <NumberOfPLayers 
        value={playerCount}
        setValue={handlePlayerCount}
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