import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Round } from '../../interfaces';

export type GameState = {
  players: string[],
  teams: string[],
  teamOnCall?: string,
  rounds: Round[],
  dealer: string,
  scoreTarget: number,
  started: boolean,
  finished: boolean
}

const initialState: GameState = {
  players: [],
  teams: [],
  rounds: [],
  dealer: '',
  scoreTarget: 1001,
  started: false,
  finished: false
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state, action: PayloadAction<{players: string[], scoreTarget: number}>) {
      const { players, scoreTarget } = action.payload;

      const teams = players.length === 4 ?
                    [`${players[0]} and ${players[2]}`, `${players[1]} and ${players[3]}`] :
                    players;

      state.started = true;
      state.finished = false;
      state.players = players;
      state.teams = teams;
      state.rounds = [];
      state.dealer = players[Math.round(Math.random() * players.length)];
      if(state.players.length === 3) {
        state.teamOnCall = state.players[(state.players.indexOf(state.dealer) + 1) % state.players.length];
      }
      state.scoreTarget = scoreTarget;
    },
    finishGame(state) {
      state.finished = true;
    },
    setDealer(state, action: PayloadAction<{dealer: string}>) {
      if(!state.started) return;

      const { dealer } = action.payload;

      if(!state.players.includes(dealer)) return;

      state.dealer = dealer;
      if(state.players.length === 3) {
        state.teamOnCall = state.players[(state.players.indexOf(dealer) + 1) % state.players.length];
      }
    },
    restart(state) {
      if(!state.started || !state.finished) return;

      state.rounds = [];
      state.finished = false;
    },
    enterRound(state, action: PayloadAction<{round: Round, index?: number}>) {
      if(!state.started) return;

      const { round, index } = action.payload;
      for(let player of state.players) {
        if(!(player in round)) return;
      }

      if(index === undefined) {
        state.rounds = [...state.rounds, round];
        state.dealer = state.players[(state.players.indexOf(state.dealer) + 1) % state.players.length];
        if(state.players.length === 3) {
          state.teamOnCall = state.players[(state.players.indexOf(state.dealer) + 1) % state.players.length];
        }
        return;
      }
      if(index < 0 || index > state.players.length -1) return;

      state.rounds[index] = round;
    },
    deleteRound(state, action: PayloadAction<{index: number}>) {
      if(!state.started) return;

      const { index } = action.payload;
      if(index < 0 || index > state.rounds.length-1) return;

      state.rounds.splice(index, 1);
    }
  }
});

// Action creators are generated for each case reducer function
export const { startGame, finishGame, setDealer, restart, enterRound, deleteRound } = gameSlice.actions;

export default gameSlice.reducer;