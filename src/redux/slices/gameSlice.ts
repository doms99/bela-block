import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { GameState, Round } from '../../interfaces';

const initialState: GameState = {
  players: [],
  rounds: [],
  dealer: '',
  scoreTarget: 1001,
  started: false,
  finished: false
};

export const gameSlice = createSlice<GameState, SliceCaseReducers<GameState>, 'game'>({
  name: 'game',
  initialState,
  reducers: {
    startGame(state, action: PayloadAction<{players: string[], scoreTarget: number}>) {
      if(state.started) return;
      const { players, scoreTarget } = action.payload;

      state.started = true;
      state.finished = false;
      state.players = players;
      state.rounds = [];
      state.dealer = players[Math.round(Math.random() * players.length)];
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
        state.dealer = state.players[(state.players.indexOf(state.dealer!) + 1) % state.players.length];
        return
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
export const { increment, decrement, incrementByAmount } = gameSlice.actions;

export default gameSlice.reducer;