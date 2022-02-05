import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { bonusPoints } from '../../constants';
import { Round } from '../../interfaces';

export type GameState = {
  rounds: Round[],
  dealer: string,
  scoreTarget: number,
  players: string[],
  teams: string[],
  teamOnCall?: string,
  started: boolean,
  finished: boolean,
  winner?: string
}

const initialState: GameState = {
  rounds: [],
  dealer: '',
  scoreTarget: 1001,
  players: [],
  teams: [],
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
      if(players.length === 3) {
        state.teamOnCall = players[(players.indexOf(state.dealer) + 1) % state.players.length];
      }
      state.scoreTarget = scoreTarget;
    },
    setDealer(state, action: PayloadAction<{dealer: string}>) {
      if(!state.started) return;

      const { dealer } = action.payload;

      if(!state.players.includes(dealer)) return;

      state.dealer = dealer;
      if(state.teams.length === 3) {
        state.teamOnCall = state.players[(state.players.indexOf(dealer) + 1) % state.players.length];
      }
    },
    restart(state) {
      if(!state.started || !state.finished) return;

      state.rounds = [];
      delete state.winner;
      state.finished = false;
    },
    reset(state) {
      if(!state.started || !state.finished) return;

      state.started = initialState.started;
      state.rounds = initialState.rounds;
      state.teams = initialState.teams;
      state.players = initialState.players;
      state.dealer = initialState.dealer;
      state.scoreTarget = initialState.scoreTarget;
      state.finished = initialState.finished;
      delete state.winner;
      delete state.teamOnCall;
    },
    enterRound(state, action: PayloadAction<{round: Round, index?: number}>) {
      if(!state.started) return;

      const { round, index } = action.payload;
      for(let player of state.players) {
        if(!(player in round)) return;
      }

      if(index !== undefined) {
        if(index < 0 || index > state.players.length -1) return;
        state.rounds[index] = round;
        return;
      }

      state.rounds = [...state.rounds, round];
      state.dealer = state.players[(state.players.indexOf(state.dealer) + 1) % state.players.length];
      if(state.players.length === 3) {
        state.teamOnCall = state.players[(state.players.indexOf(state.dealer) + 1) % state.players.length];
      }

      const winner = checkForWinner(state.rounds, state.scoreTarget);
      if(!winner) return;

      state.finished = true;
      state.winner = winner;
    },
    deleteRound(state, action: PayloadAction<{index: number}>) {
      if(!state.started) return;

      const { index } = action.payload;
      if(index < 0 || index > state.rounds.length-1) return;

      state.rounds.splice(index, 1);

      const winner = checkForWinner(state.rounds, state.scoreTarget);
      if(!winner) return;

      state.finished = false;
      delete state.winner;
    }
  }
});

function checkForWinner(rounds: Round[], scoreTarget: number): string | undefined {
  if(rounds.length === 0) return;

  const scores: {[key: string]: number} = {};

  for(let team of Object.keys(rounds[0])) {
    scores[team] = 0;
  }

  for(let round of rounds) {
    for(let [team, value] of Object.entries(round)) {
      scores[team] += value.points + value.declarations + (value.bonus ? bonusPoints : 0);
    }
  }

  let max = 0;
  let maxTeam;
  for(let [team, score] of Object.entries(scores)) {
    if(score > max) {
      max = score;
      maxTeam = team;
    }
  }

  if(max > scoreTarget) return maxTeam;
}

// Action creators are generated for each case reducer function
export const { startGame, reset, setDealer, restart, enterRound, deleteRound } = gameSlice.actions;

export default gameSlice.reducer;