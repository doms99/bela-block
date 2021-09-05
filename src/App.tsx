import Game from "./components/game/Game";
import PlayersSetup from "./components/setup/PlayersSetup";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom"; 
import { createContext, useEffect, useState } from "react";
import LocalStorageKey from './constants';

export interface Round {
  [key: string] : {
    points: number,
    declarations: number,
    bonus: boolean
  }
};

export interface TeamType {
  name: string,
  players: [string, string]
}

export interface State {
  players: string[],
  playerCount: number | undefined,
  teams: [TeamType, TeamType] | undefined,
  rounds: Round[],
  dealer: string | undefined,
  winner: string | undefined,
  scoreTarget: number
}

export type StateProperties = 'players' | 'playerCount' | 'teams' | 'points';

export interface StateFunctions {
  getState: () => State,
  startGame: (players: string[], scoreTarget: number) => void,
  restart: () => void,
  reset: () => void,
  editDealer: (player: string) => void,
  enterRound: (round: Round) => void,
  editRound: (round: Round, index: number) => void
}

const initialState: State = {
  players: [],
  playerCount: undefined,
  teams: undefined,
  rounds: [],
  dealer: undefined,
  winner: undefined,
  scoreTarget: 1001
}

export const GlobalState = createContext<StateFunctions>({} as StateFunctions);

function App() {
  const [players, setPlayers] = useState<string[]>(initialState.players);
  const [playerCount, setPlayerCount] = useState<number | undefined>(initialState.playerCount);
  const [teams, setTeams] = useState<[TeamType, TeamType] | undefined>(initialState.teams);
  const [rounds, setRounds] = useState<Round[]>(initialState.rounds);
  const [dealer, setDealer] = useState<string | undefined>(initialState.dealer);
  const [winner, setWinner] = useState<string | undefined>(initialState.winner);
  const [scoreTarget, setScoreTarget] = useState<number>(initialState.scoreTarget);

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
    }
    
  }, [scoreTarget, playerCount, players, rounds, teams]);
  
  useEffect(() => {
    const loadedState = localStorage.getItem(LocalStorageKey)

    if(!loadedState) return;
    const state = JSON.parse(loadedState) as State;

    if(state.players && 
       state.playerCount &&
       state.teams &&
       state.rounds &&
       state.dealer &&
       state.winner &&
       state.scoreTarget) return;
  
    setPlayers(state.players);
    setPlayerCount(state.playerCount);
    setTeams(state.teams);
    setRounds(state.rounds);
    setDealer(state.dealer);
    setWinner(state.winner);
    setScoreTarget(state.scoreTarget);
  }, []);

  useEffect(() => {
    localStorage.setItem(LocalStorageKey, JSON.stringify({players, playerCount, teams, rounds, dealer, winner, scoreTarget}));
  }, [players, playerCount, teams, rounds, dealer, winner, scoreTarget]);

  const getState = (): State => {
    return {players, playerCount, teams, rounds, dealer, winner, scoreTarget};
  }
  
  const startGame = (players: string[], scoreTarget: number) => {
    if(!players.length) return;


    setPlayers(players);
    setPlayerCount(players.length);
    setRounds([]);
    setDealer(players[Math.floor(Math.random() * players.length - 0.001)]);
    setScoreTarget(scoreTarget);
    setWinner(undefined);
  
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
  }

  const reset = () => {
    setPlayers(initialState.players);
    setPlayerCount(initialState.playerCount);
    setTeams(initialState.teams);
    setRounds(initialState.rounds);
    setDealer(initialState.dealer);
    setWinner(initialState.winner);
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

  const value = {
    getState,
    startGame,
    restart,
    reset,
    editDealer,
    enterRound,
    editRound
  }

  return (
    <GlobalState.Provider value={value}>
      <BrowserRouter>
        <Switch>
          {/* {globalState.playerCount ? (
            <>
              <Redirect exact from="/" to="/game" />
              <Redirect exact from="/setup" to="/game" />
            </>
          ) : (
            <>
              <Redirect exact from="/" to="/setup" />
              <Redirect exact from="/game" to="/setup" />
            </>
          )} */}
          <Redirect exact from="/" to="/setup" />
          <Route path="/setup">
            <PlayersSetup />
          </Route>
          <Route path="/game">
            {/* {globalState.playerCount ? <Game /> : <Redirect to="/setup" />} */}
            <Game />
          </Route>

        </Switch>
      </BrowserRouter>
    </GlobalState.Provider>
  );
}

export default App;