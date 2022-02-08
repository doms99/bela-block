import { GameState } from "./redux/slices/gameSlice";

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
export interface IconProps {
  className?: string,
}