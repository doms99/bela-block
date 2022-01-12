import { bonusPoints } from "./constants";
import { Bonus, GameState, Round } from "./interfaces";

export const zeroRoundValues = (teams: string[]): [Round, Bonus] => {
  const pointsAndDeclarations = teams.reduce((obj, player) => ({...obj, [player]: { points: 0, declarations: 0 }}), {});
  const bonuses = zeroBonuses(teams);

  return [pointsAndDeclarations, bonuses];
}

export const zeroBonuses = (teams: string[]): Bonus => {
  const result: Bonus = {};

  teams.forEach(team => result[team] = {value: 0, confirmed: false});

  return result;
}

export const adjustBonusesAndDeclarations = (playerPoints: Round): [Round, Bonus] => {
  const bonuses = zeroBonuses(Object.keys(playerPoints));
  const newPlayerPoints: Round = {};

  for(const [team, round] of Object.entries(playerPoints)) {
    newPlayerPoints[team] = {...round};
    if(round.bonus) {
      newPlayerPoints[team].declarations -= bonusPoints;
      bonuses[team] = {value: bonusPoints, confirmed: true};
    }
  }

  return [newPlayerPoints, bonuses];
}

export function defaultRound(...teams: string[]): Round {
  const round: Round = {};
  for(let team of teams) {
    round[team] = { 
      points: 0, 
      declarations: 0,
      bonus: false
    }
  }

  return round;
}


export function validState(state: GameState): boolean {
  const objectKeys: {[key: string]: boolean} = {};
  for(const key of Object.keys(state)) {
    objectKeys[key] = true;
  }

  if(!objectKeys.players) return false;
  if(!objectKeys.teams) return false;
  if(!objectKeys.rounds) return false;
  if(!objectKeys.dealer) return false;
  if(!objectKeys.winner) return false;
  if(!objectKeys.scoreTarget) return false;
  if(!objectKeys.started) return false;
  if(!objectKeys.finished) return false;

  return true;

//   for(const name of state.players) {
//     if(typeof name !== "string") return false;
//   }


//     name: string,
//   players: [string, string]

// players: string[],
// teams: [TeamType, TeamType] | undefined,
// rounds: Round[],
// dealer: string | undefined,
// winner: string | undefined,
// scoreTarget: number,
// started: boolean,
// finished: boolean
}