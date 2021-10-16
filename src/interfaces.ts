export interface Bonus {
  [key: string]: {
    value: number,
    confirmed: boolean
  }
}
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
export interface GameState {
  players: string[],
  playerCount: number | undefined,
  teams: [TeamType, TeamType] | undefined,
  rounds: Round[],
  dealer: string | undefined,
  winner: string | undefined,
  scoreTarget: number,
  started: boolean
}
export type StateProperties = 'players' | 'playerCount' | 'teams' | 'points';
export interface StateFunctions {
  getState: () => GameState,
  startGame: (players: string[], scoreTarget: number) => void,
  restart: () => void,
  reset: () => void,
  editDealer: (player: string) => void,
  enterRound: (round: Round) => void,
  editRound: (round: Round, index: number) => void,
  deleteRound: (index: number) => void
}
export interface Sugestion {
  text: string, 
  callback: () => void
}
export type Input = 'points' | 'declarations';
export interface SelectedInput {
  team: string, 
  input: Input
}
export interface RoundActions {
  name: string, 
  action: (index: number) => void
}