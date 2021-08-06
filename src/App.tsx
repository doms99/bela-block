import Game from "./components/game/Game";
import PlayersSetup from "./components/setup/PlayersSetup";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom"; 
import { createContext, useEffect, useState } from "react";

export interface State {
  players: string[],
  playerCount: number | undefined,
  teams: [[string, string], [string, string]] | null,
  points: Record<string, number>,
  dealer: string | undefined
}

export type StateProperties = 'players' | 'playerCount' | 'teams' | 'points';

export interface StateFunctions {
  getState: (property?: StateProperties) => any,
  startGame: (players: string[]) => void,
  restart: () => void,
  enterRound: (round: Record<string, number>) => void
}

const initialState: State = {
  players: [],
  playerCount: undefined,
  teams: null,
  points: {},
  dealer: undefined
}

export const GlobalState = createContext<StateFunctions>({} as StateFunctions);

function App() {
  const [globalState, setGlobalState] = useState<State>(initialState);

  useEffect(() => {

  });

  const getState = (property?: StateProperties) => {
    if(!property) return globalState;
  
    return globalState[property];
  }
  
  const startGame = (players: string[]) => {
    if(!players.length) return;
  
    const newState: State = {
      ...globalState,
      players,
      playerCount: players.length
    };
  
    if(players.length === 4) {
      newState.teams = [[players[0], players[2]], [players[1], players[3]]];
      newState.points = {
        [`${players[0]} and ${players[2]}`]: 0,
        [`${players[1]} and ${players[3]}`]: 0
      }
    } else {
      players.forEach(name => {
        newState.points[name] = 0;
      })
    }
  
    setGlobalState(newState);
  }
  
  const restart = () => {
    const newState = {...globalState};
    Object.keys(globalState.points).forEach(name => {
      newState.points[name] = 0;
    })
  
    setGlobalState(newState);
  }

  const enterRound = (round: Record<string, number>) => {
    if(!globalState.players.filter(name => !round[name])) return;

    setGlobalState(curr => {
      const newState = {
        ...curr,
        dealer: curr.players[(curr.players.indexOf(curr.dealer!) + 1) % curr.players.length]
      };

      globalState.players.forEach(name => newState.points[name] += round[name]);

      return newState;
    })
  }

  const value = {
    getState,
    startGame,
    restart,
    enterRound
  }

  return (
    <GlobalState.Provider value={value}>
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/setup" />
          <Route path="/setup">
            <PlayersSetup />
          </Route>
          <Route path="/game">
            <Game players={['Player1', 'player2', 'player3']} />
          </Route>
        </Switch>
      </BrowserRouter>
    </GlobalState.Provider>
  );
}

export default App;