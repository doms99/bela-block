import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { bonusPoints } from '../../../constants';
import { Input, Round, SelectedInput, Sugestion } from "../../../interfaces";
import { defaultRound } from '../../../utils';
import RoundEntryView from '../views/RoundEntryView';

export interface Props {
  team1: string,
  team2: string,
  team3: string,
  teamOnCall: string,
  teamPoints?: Round,

  pointsReport: (round: Round) => void,
  cancel: () => void
}

const RoundEntry: React.FC<Props> = ({ team1, team2, team3, teamOnCall, teamPoints, pointsReport, cancel }) => {  
  const [values, setValues] = useState<Round>(teamPoints ? teamPoints : defaultRound(team1, team2, team3));
  const [selected, setSelected] = useState<SelectedInput>({team: team1, input: 'points'});
  const [error, setError] = useState<string>();
  const [bonusSuggestion, setBonusSuggestion] = useState<string>();
  const [fallSuggestion, setFallSuggestion] = useState<boolean>(false);
  const [fallen, setFallen] = useState<boolean>(false);
  const [edited, setEdited] = useState<string[]>([]);

  const totalPoints = useCallback(() => {
    return Object.values(values).map(value => value.points).reduce((sum, points) => sum + points, 0);
  }, [values]);

  const select = useCallback((team: string, input: Input) => setSelected({team, input}), []);

  // error check: too much points
  useEffect(() => {
    if(totalPoints() <= 162) {
      setError(undefined);

      return;
    }

    setError("More then 162 points entered");
  }, [values, totalPoints]);

  // bonus points suggestion
  useEffect(() => {
    if(!!fallen) return;

    for(let team of [team1, team2, team3]) {
      if(values[team].points === 162 && selected.team === team) {
        setBonusSuggestion(team);
        return;
      }
    }
  }, [values, selected, fallen, team1, team2, team3]);

  // fall suggestion
  useEffect(() => {
    if(edited.length < 2) return;

    const others = [team1, team2, team3].filter(t => t !== teamOnCall);
    const teamOCSum = values[teamOnCall].points + values[teamOnCall].declarations;
    const othersSum = values[others[0]].points + values[others[0]].declarations +
                      values[others[1]].points + values[others[1]].declarations;
    
    
    if(teamOCSum <= othersSum && values[teamOnCall].points !== 0) setFallSuggestion(true);
    else setFallSuggestion(false)
  }, [edited, values, team1, team2, team3, teamOnCall]);

  function updateState(state: Round, eded: string[]) {
    if(eded.length !== 2) return state;

    const unedited = [team1, team2, team3].filter(t => !eded.includes(t))[0];
    return {
      ...state,
      [unedited]: {
        ...state[unedited],
        points: Math.max(0, 162 - state[eded[0]].points - state[eded[1]].points)
      }
    }
  }

  function setValue(digit: number) {
    if(Math.floor(values[selected.team][selected.input]/100) !== 0) return;

    setFallen(false);
    const newEdited = edited.includes(selected.team) ? edited : [...edited, selected.team];
    setEdited(newEdited)
    setValues(curr => updateState({
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: curr[selected.team][selected.input]*10 + digit
        }
      }, newEdited));
  }

  function clear() {    
    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: 0
      }
    }, edited));
  }

  function backspace() {
    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: Math.floor(curr[selected.team][selected.input] / 10)
      }
    }, edited));
  }

  function end() {
    if(totalPoints() > 162) {
      setError("Can't enter more then 162 points");

      return;
    }

    for(const team of [team1, team2, team3]) {
      if(values[team].points === 0) {
        values[team].declarations = 0;
        continue;
      }
    }

    pointsReport(values);
  }

  function fall() {
    setFallen(true);
    setFallSuggestion(false)
    setValues(curr => {
      const newValues = {...curr};

      newValues[teamOnCall].points = 0;
      newValues[teamOnCall].declarations = 0;

      return newValues;
    })
  }

  const suggestions: {[key: string]: Sugestion} = {};
  for(const team of [team1, team2, team3]) {
    if(fallSuggestion) {
      suggestions[teamOnCall] = {
        text: "fall?", 
        callback: () => fall()
      }
    } else if(bonusSuggestion === team) {
      suggestions[team] = {
        text: `+${bonusPoints} points`,
        callback: () => setValues(curr => ({...curr, [team]: {...curr[team], bonus: !curr[team].bonus}}))
      }
    }
  }

  return (
    <RoundEntryView 
      teams={[team1, team2, team3]}
      round={values}
      error={error}
      sugestions={suggestions}
      canSaveRound={!!!error}
      selected={selected}
      setSelected={select}
      cancel={cancel}
      numberClick={setValue}
      backspace={backspace}
      clear={clear}
      saveRound={end}
    />
  );
};

export default RoundEntry;