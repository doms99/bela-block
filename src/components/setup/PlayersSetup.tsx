import React, { useCallback, useContext, useEffect, useState } from 'react';
import SittingOrder from './views/SittingOrder';
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

  const hasRepeatedNames = useCallback((): PlayersError | undefined => {
    const current = playerNames.slice(0, playerCount);
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

  }, [playerNames, playerCount]);

  const hasEmptyNames = useCallback((): PlayersError | undefined => {
    const current = playerNames.slice(0, playerCount);

    const nonEntered = current.map((name, index) => ({name, index})).filter(obj => obj.name.trim() === "").map(obj => obj.index);
    if(nonEntered.length !== 0) return {text: "All names must be entered", sources: nonEntered};

  }, [playerNames, playerCount]);

  const updateError = useCallback(() => {
    setError(hasEmptyNames() || hasRepeatedNames());
  }, [hasEmptyNames, hasRepeatedNames]);

  useEffect(() => {
    updateError();
  }, [updateError]);

  const handlePlayerCount = useCallback((newPlayerCount: number) => {
    setPlayerCount(newPlayerCount);
    setScoreTarget(newPlayerCount === 4 ? 1001 : newPlayerCount === 3 ? 701 : 501);
  }, []);

  const handleNameChange = useCallback((name: string, index: number) => {
    setPlayerNames(curr => {
      const newPlayerNames = [...curr];
      newPlayerNames[index] = name;

      return newPlayerNames;
    })
  }, []);

  const start = () => {
    if(!!error) {
      setStartTried(true);
      return;
    }

    startGame(playerNames.slice(0, playerCount), scoreTarget);
    history.push('/game');
  }

  const handleSubmit = (e: React.FormEvent) => {
    console.log(e)
    e.preventDefault();
    start();
  }

  return (
    <div className="text-right text-white overflow-x-hidden">
      <main className="green-backdrop pb-8 pt-8">
        <form onSubmit={handleSubmit} className="h-65vh w-full pt-12">
          <SittingOrder 
            playerNames={playerNames.slice(0, playerCount)}
            setName={handleNameChange}
            error={startTried ? error : undefined}
          />
        </form>
      </main>
      <div className="w-full -mt-12 h-24 flex justify-between">
        <div className="placeholder" />
        <button
          className="mr-16 w-24 h-24 outlined-bnt-flipped 
                   text-white hover:text-white-active"
          onClick={start}
        >
          <ConfirmIcon className="w-4/6 m-auto" />
        </button>
      </div>
      <NumberOfPLayers 
        value={playerCount}
        setValue={handlePlayerCount}
      />
    </div>
  );
};

export default PlayersSetup;