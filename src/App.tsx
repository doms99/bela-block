import Game from "./components/game/controllers/Game";
import PlayersSetup from "./components/setup/PlayersSetup";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom"; 
import { createContext, useEffect, useMemo, useState } from "react";
import { LocalStorageKey } from './constants';
import { GameState, StateFunctions, TeamType, Round } from "./interfaces";
import { validState } from "./utils";

const initialState: GameState = {
  players: [],
  teams: undefined,
  rounds: [],
  dealer: undefined,
  winner: undefined,
  scoreTarget: 1001,
  started: false,
  finished: false
}

export const GlobalState = createContext<StateFunctions>({} as StateFunctions);

const getInitialState = (): GameState => {
  const loadedState = localStorage.getItem(LocalStorageKey)

  if(!loadedState) return initialState;
  const state = JSON.parse(loadedState) as GameState;

  return validState(state) ? state : initialState;
}

function App() {
  const state = useMemo(getInitialState, []);
  
  const [players, setPlayers] = useState<string[]>(state.players);
  const [playerCount, setPlayerCount] = useState<number | undefined>(state.players.length);
  const [teams, setTeams] = useState<[TeamType, TeamType] | undefined>(state.teams);
  const [rounds, setRounds] = useState<Round[]>(state.rounds);
  const [dealer, setDealer] = useState<string | undefined>(state.dealer);
  const [winner, setWinner] = useState<string | undefined>(state.winner);
  const [scoreTarget, setScoreTarget] = useState<number>(state.scoreTarget);
  const [started, setStarted] = useState<boolean>(state.started);
  const [finished, setFinished] = useState(state.finished);

  // Winner evaluation and setting
  useEffect(() => {
    if(!playerCount) return;

    const score: Record<string, number> = {};

    let names: string[];
    if(playerCount === 4 && teams) {
      names = teams.map(team => team.name);
    } else {
      names = players;
    } 

    names.forEach(name => score[name] = 0);

    rounds.forEach(round => names.forEach(name => {
      score[name] += round[name].points + round[name].declarations;
    }))

    let max = -1;
    let maxPlayer: string;

    for(let [player, points] of Object.entries(score)) {
      if(points > scoreTarget && points > max) {
        max = points;
        maxPlayer = player;
      }
    }

    if(max > -1) {
      setWinner(maxPlayer!);
      setFinished(true);
    } else {
      setWinner(undefined);
    }
    
  }, [scoreTarget, playerCount, players, rounds, teams]);
  
  // useEffect(() => {
  //   const loadedState = localStorage.getItem(LocalStorageKey)

  //   if(!loadedState) return;
  //   const state = JSON.parse(loadedState) as GameState;

  //   if(state.players && 
  //      state.playerCount &&
  //      state.teams &&
  //      state.rounds &&
  //      state.dealer &&
  //      state.winner &&
  //      state.scoreTarget &&
  //      state.started) return;
  
  //   setPlayers(state.players);
  //   setPlayerCount(state.playerCount);
  //   setTeams(state.teams);
  //   setRounds(state.rounds);
  //   setDealer(state.dealer);
  //   setWinner(state.winner);
  //   setScoreTarget(state.scoreTarget);
  //   setStarted(state.started);
  // }, []);

  useEffect(() => {
    localStorage.setItem(LocalStorageKey, JSON.stringify({players, playerCount, teams, rounds, dealer, winner, scoreTarget, started}));
  }, [players, playerCount, teams, rounds, dealer, winner, scoreTarget, started]);

  const getState = (): GameState => {
    return {players, teams, rounds, dealer, winner, scoreTarget, started, finished};
  }
  
  const startGame = (players: string[], scoreTarget: number) => {
    if(!players.length) return;


    setPlayers(players);
    setPlayerCount(players.length);
    setRounds([]);
    setDealer(players[Math.round(Math.random() * (players.length - 1))]);
    setScoreTarget(scoreTarget);
    setWinner(undefined);
    setStarted(true);
    setFinished(false);
  
    setTeams(players.length === 4 ? [
      {
        name: `${players[0]} and ${players[2]}`,
        players: [players[0], players[2]]
      }, {
        name: `${players[1]} and ${players[3]}`,
        players: [players[1], players[3]]
      }
    ] : undefined);
  }

  const editDealer = (player: string) => {
    if(!players.includes(player)) return;

    setDealer(player);
  }
  
  const restart = () => { 
    setRounds([]);
    setWinner(undefined);
    setFinished(false);
  }

  const reset = () => {
    setPlayers(initialState.players);
    setPlayerCount(initialState.players.length);
    setTeams(initialState.teams);
    setRounds(initialState.rounds);
    setDealer(initialState.dealer);
    setWinner(initialState.winner);
    setFinished(false);
  }

  const enterRound = (round: Round) => {    
    if(!players.filter(name => !round[name])) return;

    setRounds(curr => [...curr, round]);
    setDealer(players[(players.indexOf(dealer!) + 1) % players.length]);
  }

  const editRound = (round: Round, index: number) => {
    if(!players.filter(name => !round[name])) return;

    setRounds(curr => {
      const newRounds = [...curr];
      newRounds[index] = round;
      
      return newRounds;
    });
  }

  const deleteRound = (index: number) => {
    if(index < 0 || index > rounds.length-1) return;

    setRounds(curr => {
      const newRounds = [...curr];
      newRounds.splice(index, 1);

      return newRounds;
    });
  }

  const value = {
    getState,
    startGame,
    restart,
    reset,
    editDealer,
    enterRound,
    editRound,
    deleteRound
  }

  return (
    <GlobalState.Provider value={value}>
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/setup" />
          {!started ? (
            <Redirect exact from="/game" to="/setup" />
          ) : (
            <Redirect exact from="/setup" to="/game" />
          )}
          <Route path="/setup">
            <PlayersSetup />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Redirect from="/*" to="/setup" />
        </Switch>
      </BrowserRouter>
    </GlobalState.Provider>
  );
}

export default App;