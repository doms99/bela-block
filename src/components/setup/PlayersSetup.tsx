import React, { memo, useCallback, useEffect, useState } from 'react';
import SittingOrder from './SittingOrder';
import Arrow from '../icons/Arrow';
import { useHistory } from 'react-router';
import NumberOfPLayers from './NumberOfPLayers';
import ConfirmIcon from '../icons/ConfirmIcon';
import GameWrapper from '../game/GameWrapper';
import { useDispatch, useSelector } from '../../redux/hooks';
import { startGame } from '../../redux/slices/gameSlice';

export type PlayersError = (string | undefined)[];

const PlayersSetup = () => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [scoreTarget, setScoreTarget] = useState<number>(1001);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [errors, setErrors] = useState<PlayersError>([undefined, undefined, undefined, undefined]);
  const [startTried, setStartTried] = useState<boolean>(false);
  const gameInProgress = useSelector(state => state.game.started && !state.game.finished);
  const history = useHistory();
  const dispatch = useDispatch();

  const hasRepeatedNames = useCallback((): PlayersError => {
    const current = playerNames.slice(0, playerCount);
    const foundErrors: PlayersError = current.map(() => undefined);

    for (let [index, name] of current.entries()) {
      if(!!foundErrors[index]) continue;

      const first = current.indexOf(name.trim());
      const last = current.lastIndexOf(name.trim());

      if (index === last && index === first) continue;

      foundErrors[index] = 'Names must be unique';
      foundErrors[first] = 'Names must be unique';
      foundErrors[last] = 'Names must be unique';
    }

    return foundErrors;

  }, [playerNames, playerCount]);

  const hasEmptyNames = useCallback((): PlayersError => {
    const current = playerNames.slice(0, playerCount);
    const foundErrors: PlayersError = current.map(() => undefined);

    for(let [index, name] of current.entries()) {
      if(name.trim() === '') foundErrors[index] = "Names can't be empty";
    }

    return foundErrors;

  }, [playerNames, playerCount]);

  useEffect(() => {
    // const empty = hasEmptyNames();
    const repeated = hasRepeatedNames();

    // setErrors(empty.map((e, i) => !!e ? e : repeated[i]));
    setErrors(repeated)
  }, [hasEmptyNames, hasRepeatedNames, startTried]);

  const setPlayerCountHandler = useCallback((newPlayerCount: number) => {
    setPlayerCount(newPlayerCount);
    setScoreTarget(newPlayerCount === 4 ? 1001 : newPlayerCount === 3 ? 701 : 501);
  }, []);

  const setName = useCallback((name: string, index: number) => {
    setPlayerNames(curr => {
      const newPlayerNames = [...curr];
      newPlayerNames[index] = name;

      return newPlayerNames;
    })
  }, []);

  const activeGameCallback = useCallback(() => {
    history.push('/game');
  }, [history]);

  const start = useCallback(() => {
    if (errors.some(e => e !== undefined)) {
      setStartTried(true);
      return;
    }

    dispatch(startGame({players: playerNames.slice(0, playerCount), scoreTarget}));
    history.push('/game');
  }, [dispatch, errors, history, playerCount, playerNames, scoreTarget]);


  return (
    <PlayersSetupView
      hasActivGame={gameInProgress}
      playerNames={playerNames}
      numberOfPlayers={playerCount}
      errors={startTried ? errors : undefined}

      activeGameCallback={activeGameCallback}
      setName={setName}
      setPlayerCount={setPlayerCountHandler}
      startGame={start}
    />
  )
};

export default PlayersSetup;

export type ViewProps = {
  hasActivGame: boolean,
  playerNames: string[],
  numberOfPlayers: number,
  errors?: PlayersError,

  activeGameCallback?: () => void,
  setName: (name: string, index: number) => void,
  setPlayerCount: (number: number) => void,
  startGame: () => void
}

export const PlayersSetupView: React.FC<ViewProps> = memo((props) => {
  const { hasActivGame, playerNames, numberOfPlayers, errors, setName, setPlayerCount, startGame } = props;

  return (
    <GameWrapper
      bottom={
        <NumberOfPLayers
          value={numberOfPlayers}
          setValue={setPlayerCount}
        />
      }
    >
        {hasActivGame && (
          <button
            onClick={props.activeGameCallback}
            className="absolute top-0 right-0 mt-4 mr-5"
          >
            <Arrow className="h-7 stroke-primary-active rotate-180"/>
          </button>
        )}
        <form className="green-backdrop h-full pb-8 pt-20">
          <SittingOrder
            playerNames={playerNames}
            numberOfPlayers={numberOfPlayers}
            setName={setName}
            errors={!!errors ? errors : playerNames.map(() => undefined)}
          />
        </form>
        <div className="text-right px-16 sm:px-28 transition-all -mt-8 w-full">
          <button
            className="w-24 h-24 outlined-bnt-flipped
                     text-white hover:text-white-active"
            onClick={startGame}
          >
            <ConfirmIcon className="w-4/6 m-auto" />
          </button>
        </div>
    </GameWrapper>
  );
});