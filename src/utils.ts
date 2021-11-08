import { bonusPoints } from "./constants";
import { Bonus, Round } from "./interfaces";

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