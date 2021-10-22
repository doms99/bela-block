import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { bonusPoints } from '../../../constants';
import { Bonus, Input, Round, SelectedInput } from "../../../interfaces";
import { adjustBonusesAndDeclarations, zeroRoundValues } from '../../../utils';
import RoundEntryView from '../views/RoundEntryView';

export interface Props {
  teams: string[],
  playerPoints?: Round,
  pointsReport: (round: Round) => void,
  playerCount: number,
  cancel: () => void,
  teamOnCall?: string
}

const RoundEntry: React.FC<Props> = ({ teams, teamOnCall, playerPoints, playerCount, pointsReport, cancel }) => {
  const [playerPointsAdjusted, bonusesCalculated] = playerPoints ? adjustBonusesAndDeclarations(playerPoints) : zeroRoundValues(teams);
  
  const [values, setValues] = useState<Round>(playerPointsAdjusted);
  const [selected, setSelected] = useState<SelectedInput>({team: teams[0], input: 'points'});
  const [error, setError] = useState<string>();
  const [pass, setPass] = useState<boolean>();
  const [edited, setEdited] = useState<boolean[]>(teams.map(team => !playerPoints || team === teamOnCall ? false : true));
  const [bonuses, setBonuses] = useState<Bonus>(bonusesCalculated);
  const [fallSuggestion, setFallSuggestion] = useState<boolean[]>(teams.map(_ => false));
  const [fallen, setFallen] = useState<string>();

  const calcPoints = useCallback(() => {
    return Object.values(values).map(value => value.points).reduce((sum, points) => sum + points, 0);
  }, [values]);

  useEffect(() => {
    if(calcPoints() <= 162) {
      setError(undefined);

      return;
    }

    setError("More then 162 points entered");
  }, [values, calcPoints]);

  useEffect(() => {
    if(Object.values(values).map((round) => round.points).reduce((sum, val) => sum += val, 0) === 0) {
      setEdited(teams.map(_ => false));
    }
  }, [values, teams]);

  useEffect(() => {
    if(!!fallen) return;

    for(const team of teams) {
      if(values[team].points === 162) {
        setBonuses(curr => ({...curr, [team]: {value: bonusPoints, confirmed: values[team].bonus ? true : playerCount === 3 ? true : false}}));
        continue;
      }

      setBonuses(curr => ({...curr, [team]: {value: 0, confirmed: false}}))
    }
  }, [values, teams, fallen, playerCount]);

  useEffect(() => {
    if(playerCount !== 3) return;

    const otherTeamsPoints = Object.entries(values)
      .filter(([team]) => team !== teamOnCall)
      .map(([team, round]) => round.points + round.declarations + (bonuses[team].confirmed ? bonuses[team].value : 0))
      .reduce((sum, points) => sum += points, 0);

    if(otherTeamsPoints === 0 && values[teamOnCall!].points !== 162) {
      setPass(undefined);
      return;
    }

    if(otherTeamsPoints === 162) {
      setPass(false);
      return;
    }

    if(values[teamOnCall!].points === 162) {
      setPass(true);
      return;
    }

    if(edited.reduce((val, status) => status ? val : val+1, 0) > 1) return;

    if(values[teamOnCall!].points + values[teamOnCall!].declarations + (bonuses[teamOnCall!].confirmed ? bonuses[teamOnCall!].value : 0) <= otherTeamsPoints) {
      setPass(false);
      return;
    }

    setPass(true);
  }, [teams, values, teamOnCall, bonuses, edited, playerCount]);

  useEffect(() => {
    if(playerCount === 3) return;
    if(playerCount === 4 && (!edited[0] && !edited[1])) return;
    if(playerCount === 2 && (!edited[0] || !edited[1])) return;
    if(values[teams[0]].points === 162 || values[teams[1]].points === 162 ||
       values[teams[0]].points === 0 || values[teams[1]].points === 0) {
      setFallSuggestion([false, false]);
      return;
    }

    const teamOnePoints = values[teams[0]].points + values[teams[0]].declarations + (bonuses[teams[0]].confirmed ? bonuses[teams[0]].value : 0);
    const teamTwoPoints = values[teams[1]].points + values[teams[1]].declarations + (bonuses[teams[1]].confirmed ? bonuses[teams[1]].value : 0);

    switch(Math.min(1, Math.max(teamOnePoints - teamTwoPoints, -1))) {
      case 1:
        setFallSuggestion([false, true]);
        break;
      case -1:
        setFallSuggestion([true, false]);
        break;
      default:
        setFallSuggestion([true, true]);
    }
  }, [bonuses, playerCount, values, teams, edited]);

  const updateState_2 = (state: Round) => state;

  const updateState_3 = (state: Round, edited: boolean[]) => {
    if(edited.reduce((val, status) => status ? val : val+1, 0) !== 1) return state;

    const uneditedPlayer = teams[edited.indexOf(false)];

    let uneditedPlayerPoints = 162 - teams.filter(name => name !== uneditedPlayer).reduce((val, name) => val += state[name].points, 0);
    let newState = {
      ...state,
      [uneditedPlayer]: {
        ...state[uneditedPlayer],
        points: Math.max(0, uneditedPlayerPoints)
      }
    };

    const teamOnCallPoints = newState[teamOnCall!].points + newState[teamOnCall!].declarations + bonuses[teamOnCall!].value;
    const sumOfRest = Object.entries(newState)
                        .filter(([team]) => team !== teamOnCall)
                        .map(([team, round]) => round.points + round.declarations + bonuses[team].value)
                        .reduce((sum, val) => sum + val, 0);
    
    if(sumOfRest >= teamOnCallPoints) {
      return {
        ...newState,
        [teamOnCall!]: {
          ...state[teamOnCall!],
          points: 0
        }
      }
    }
    
    return newState;
  }

  const updateState_4 = (state: Round) => {
    if(playerCount === 2) return state;
    if(selected.input === 'declarations') return state;

    const otherPlayers = teams.filter(name => name !== selected.team);

    return {
      ...state,
      [otherPlayers[0]]: {
        ...state[otherPlayers[0]],
        points: Math.max(162 - state[selected.team].points, 0)
      }
    };
  }

  let updateState: (state: Round, edited: boolean[]) => Round;
  switch(playerCount) {
    case 3:
      updateState = updateState_3;
      break;
    case 4:
      updateState = updateState_4;
      break;
    default:
      updateState = updateState_2;
  }

  const updateEdited = () => {
    let passedEdited: boolean[] = edited;
    if(selected.input === 'points') {
      setEdited(curr => {
        const newEdited = [...curr];
        newEdited[teams.indexOf(selected.team)] = true;
  
        passedEdited = newEdited;
        return newEdited;
      })
    }

    return passedEdited;
  }

  const setValue = (digit: number) => {
    if(Math.floor(values[selected.team][selected.input]/100) !== 0) return;
    
    const passedEdited = updateEdited();

    setFallen(undefined);

    setValues(curr => {
      const newState = {
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: curr[selected.team][selected.input]*10 + digit
        }
      }

      return updateState(newState, passedEdited);
    });
  }

  const clear = () => {
    if(values[selected.team][selected.input] !== 0) setFallen(undefined);

    const passedEdited = updateEdited();
    
    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: 0
      }
    }, passedEdited));
  }

  const backspace = () => {
    if(values[selected.team][selected.input] !== 0) setFallen(undefined);

    const passedEdited = updateEdited();

    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: Math.floor(curr[selected.team][selected.input] / 10)
      }
    }, passedEdited));
  }

  const end = () => {
    if(calcPoints() > 162) {
      setError("Can't enter more then 162 points");

      return;
    }

    const reportState = {...values};
    for(const team of teams) {
      if(reportState[team].points === 0) {
        reportState[team].declarations = 0;
        continue;
      }

      if(bonuses[team].confirmed) {
        reportState[team].declarations += bonuses[team].value;
        reportState[team].bonus = true;
      } else {
        reportState[team].bonus = false;
      }
    }

    pointsReport(reportState);
  }

  const fall = (team: string) => {
    setFallen(team);
    setFallSuggestion([false, false]);
    setValues(curr => {
      const newValues = {...curr};
      const otherTeam = teams.filter(name => name !== team)[0];

      newValues[otherTeam].points += newValues[team].points;
      newValues[otherTeam].declarations += newValues[team].declarations;
      newValues[team].points = 0;
      newValues[team].declarations = 0;

      return newValues;
    })
  }

  const sugestions = teams.reduce((res, team, index) => (
    { ...res,
      [team]: fallSuggestion[index] ? {
        text: "fall?", 
        callback: () => fall(team)
      } : 
      !!bonuses[team].value ? 
        {
          text: `+${bonusPoints} points`,
          callback: () => setBonuses(curr => ({...curr, [team]: {...curr[team], confirmed: !curr[team].confirmed}}))
        } :
      undefined
    }
  ), {});

  return (
    <RoundEntryView 
      teams={teams}
      round={values}
      error={error}
      sugestions={sugestions}
      canSaveRound={!!!error && edited.some(v => v)}
      selected={selected}
      setSelected={(team: string, input: Input) => setSelected({team, input})}
      cancel={cancel}
      numberClick={setValue}
      backspace={backspace}
      clear={clear}
      saveRound={end}
    />
  );
};

export default RoundEntry;