import React, { useCallback, useEffect, useState } from 'react';
import SittingOrder from './views/SittingOrder';
import Arrow from '../icons/Arrow';
import { GlobalState } from '../../App';
import { useHistory } from 'react-router';
import NumberOfPLayers from './views/NumberOfPLayers';
import ConfirmIcon from '../icons/ConfirmIcon';
import GameWrapper from '../game/controllers/GameWrapper';
import { useSelector } from '../../redux/hooks';

export type PlayersError = (string | undefined)[];

const PlayersSetup = () => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [scoreTarget, setScoreTarget] = useState<number>(1001);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [errors, setErrors] = useState<PlayersError>([undefined, undefined, undefined, undefined]);
  const [startTried, setStartTried] = useState<boolean>(false);
  const gameInProgress = useSelector(state => state.game.started && !state.game.finished);
  const history = useHistory();

  const hasRepeatedNames = useCallback((): PlayersError | undefined => {
    const current = playerNames.slice(0, playerCount);
    const foundErrors: PlayersError = [...errors];

    for (const name of current) {
      const first = current.indexOf(name.trim());
      const last = current.lastIndexOf(name.trim());
      if (first === last) continue;

      foundErrors[first] = 'Names must be unique';
      foundErrors[last] =
    }

    return errors;

  }, [playerNames, playerCount]);

  const hasEmptyNames = useCallback((): PlayersError | undefined => {
    const current = playerNames.slice(0, playerCount);

    const nonEntered = current.map((name, index) => ({ name, index })).filter(obj => obj.name.trim() === "").map(obj => obj.index);
    if (nonEntered.length !== 0) return { text: "All names must be entered", sources: nonEntered };

  }, [playerNames, playerCount]);

  useEffect(() => {
    setErrors(hasEmptyNames() || hasRepeatedNames());
  }, [hasEmptyNames, hasRepeatedNames, startTried]);

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
    if (!!errors) {
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
    <PlayersSetupView
      hasActivGame={gameInProgress}
      playerNames={playerNames.slice(0, playerCount)}
      errors={}
    />
  )
};

export default PlayersSetup;

export type ViewProps = ({
  hasActivGame: false
} | {
  hasActivGame: true,
  activeGameCallback: () => void
}) & {
  playerNames: string[],
  errors?: PlayersError,
  reportName: (name: string, index: number) => void,
  setPlayerCount: (number: number) => void,
  startGame: () => void
}

export const PlayersSetupView: React.FC<ViewProps> = (props) => {
  const { hasActivGame, playerNames, errors, reportName, setPlayerCount, startGame  } = props;

  return (
    <GameWrapper
      main={(
        <div className="relative overflow-x-hidden">
          {hasActivGame && (
            <button
              onClick={props.activeGameCallback}
              className="absolute top-0 right-0 mt-4 mr-5"
            >
              <Arrow className="h-7 stroke-primary-active rotate-180"/>
            </button>
          )}
          <form className="green-backdrop h-3/4 pb-8 pt-20">
            <SittingOrder
              playerNames={playerNames}
              setName={reportName}
              error={errors}
            />
          </form>
          <div className="w-full -mt-12 h-24 flex justify-between">
            <div className="placeholder" />
            <button
              className="mr-16 w-24 h-24 outlined-bnt-flipped
                       text-white hover:text-white-active"
              onClick={startGame}
            >
              <ConfirmIcon className="w-4/6 m-auto" />
            </button>
          </div>
        </div>
      )}
      bottom={
        <NumberOfPLayers
          value={playerNames.length}
          setValue={setPlayerCount}
        />
      }
    />
  );
};