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

export interface State {
  players: string[],
  playerCount: number | undefined,
  teams: [[string, string], [string, string]] | null,
  rounds: Record<string, {points: number, declarations: number}>[],
  dealer: string | undefined
}

export type StateProperties = 'players' | 'playerCount' | 'teams' | 'points';

export interface StateFunctions {
  getState: () => State,
  startGame: (players: string[]) => void,
  rematch: () => void,
  reset: () => void,
  enterRound: (round: Record<string, {points: number, declarations: number}>) => void,
  editRound: (round: Record<string, {points: number, declarations: number}>, index: number) => void
}

const initialState: State = {
  players: [],
  playerCount: undefined,
  teams: null,
  rounds: [],
  dealer: undefined
}

export const GlobalState = createContext<StateFunctions>({} as StateFunctions);

function App() {
  const [globalState, setGlobalState] = useState<State>(initialState);

  useEffect(() => {
    const loadedState = localStorage.getItem(LocalStorageKey)

    if(!loadedState) return;

    const state = JSON.parse(loadedState);
    setGlobalState(curr => ({...curr, ...state}));
  }, []);

  const getState = (): State => {
    return globalState;
  }
  
  const startGame = (players: string[]) => {
    if(!players.length) return;
  
    const newState: State = {
      ...globalState,
      players,
      playerCount: players.length,
      rounds: [],
      dealer: players[Math.floor(Math.random() * players.length - 0.001)]
    };
  
    if(players.length === 4) {
      newState.teams = [[players[0], players[2]], [players[1], players[3]]];
    }
  
    setGlobalState(newState);

    localStorage.setItem(LocalStorageKey, JSON.stringify(newState));
  }
  
  const rematch = () => { 
    setGlobalState(curr => {
      const newState = {
        ...curr,
        rounds: []
      }

      localStorage.setItem(LocalStorageKey, JSON.stringify(newState));

      return newState;
    })
  }

  const reset = () => {
    setGlobalState(initialState);
    localStorage.setItem(LocalStorageKey, JSON.stringify(initialState));
  }

  const enterRound = (round: Record<string, {points: number, declarations: number}>) => {    
    if(!globalState.players.filter(name => !round[name])) return;

    setGlobalState(curr => {
      const newState = {
        ...curr,
        rounds: [...curr.rounds, round],
        dealer: curr.players[(curr.players.indexOf(curr.dealer!) + 1) % curr.players.length]
      };

      localStorage.setItem(LocalStorageKey, JSON.stringify(newState));

      return newState;
    })
  }

  const editRound = (round: Record<string, {points: number, declarations: number}>, index: number) => {
    if(!globalState.players.filter(name => !round[name])) return;

    setGlobalState(curr => {
      const newState = {...curr};
      newState.rounds[index] = round;

      localStorage.setItem(LocalStorageKey, JSON.stringify(newState));
      
      return newState;
    })
  }

  const value = {
    getState,
    startGame,
    rematch,
    reset,
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