import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { bonusPoints } from '../../constants';
import { Input, Round, SelectedInput, Sugestion } from "../../interfaces";
import { defaultRound } from '../../utils';
import RoundEntryView from './RoundEntryView';

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
      if(values[team].points === 162) {
        setBonusSuggestion(team);
        return;
      }
    }

    setBonusSuggestion(undefined);
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

  const updateState = useCallback((state: Round, eded: string[]) => {
    if(eded.length !== 2) return state;

    const unedited = [team1, team2, team3].filter(t => !eded.includes(t))[0];
    return {
      ...state,
      [unedited]: {
        ...state[unedited],
        points: Math.max(0, 162 - state[eded[0]].points - state[eded[1]].points)
      }
    }
  }, [team1, team2, team3]);

  const setValue = useCallback((digit: number) => {
    if(values[selected.team][selected.input] / 100 > 1) return;
    if(Math.floor(values[selected.team][selected.input]/100) !== 0) return;

    setFallen(false);
    const newEdited = edited.includes(selected.team) ? edited : [...edited, selected.team];
    setEdited(newEdited)
    setValues(curr => {
      const newState = {
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: curr[selected.team][selected.input]*10 + digit
        }
      };

      if(selected.input === 'declarations') return newState;

      return updateState(newState, newEdited);
    });
  }, [edited, selected, updateState, values]);

  const clear = useCallback(() => {
    const newEdited = [...edited, selected.team];
    setEdited(newEdited)

    setValues(curr => {
      if(curr[selected.team][selected.input] === 0) return curr;

      return updateState({
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: 0,
          bonus: false,
        }
      }, newEdited);
    });
  },[edited, selected, updateState]);

  const backspace = useCallback(() => {
    const newEdited = [...edited, selected.team];
    setEdited(newEdited)

    setValues(curr => {
      if(curr[selected.team][selected.input] === 0) return curr;

      const points = Math.floor(curr[selected.team][selected.input] / 10);

      return updateState({
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: points,
          bonus: false,
        }
      }, newEdited);
    });
  }, [edited, selected, updateState]);

  const end = useCallback(() => {
    for(const team of [team1, team2, team3]) {
      if(values[team].points === 0) {
        values[team].declarations = 0;
        continue;
      }
    }

    pointsReport(values);
  }, [pointsReport, team1, team2, team3, values]);

  const suggestions: {[key: string]: Sugestion} = {};
  for(const team of [team1, team2, team3]) {
    if(bonusSuggestion === team) {
      suggestions[team] = {
        text: `+${bonusPoints} points`,
        callback: () => setValues(curr => ({...curr, [team]: {...curr[team], bonus: !curr[team].bonus}}))
      }
    }
  }

  const roundValue = !fallSuggestion ? values : {
    ...values,
    [teamOnCall]: {
      points: 0,
      declarations: 0,
      bonus: false
    }
  };

  return (
    <RoundEntryView
      teams={[team1, team2, team3]}
      teamOnCall={teamOnCall}
      round={roundValue}
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