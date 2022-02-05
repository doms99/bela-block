import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { bonusPoints } from '../../constants';
import { Input, Round, SelectedInput, Sugestion } from "../../interfaces";
import { defaultRound } from '../../utils';
import RoundEntryView from './RoundEntryView';

export interface Props {
  team1: string,
  team2: string,
  playerCount: number,
  teamPoints?: Round,

  pointsReport: (round: Round) => void,
  cancel: () => void
}

const RoundEntry: React.FC<Props> = ({ team1, team2, playerCount, teamPoints, pointsReport, cancel }) => {
  const [values, setValues] = useState<Round>(teamPoints ? teamPoints : defaultRound(team1, team2));
  const [selected, setSelected] = useState<SelectedInput>({team: team1, input: 'points'});
  const [error, setError] = useState<string>();
  const [bonusSuggestion, setBonusSuggestion] = useState<string>();
  const [fallSuggestion, setFallSuggestion] = useState<string[]>([]);
  const [fallen, setFallen] = useState<string>();
  const [edited, setEdited] = useState(false);

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

    for(let team of [team1, team2]) {
      if(values[team].points === 162 && selected.team === team) {
        setBonusSuggestion(team);
        return;
      }
    }
  }, [values, selected, fallen, team1, team2]);

  // fall suggestion
  useEffect(() => {
    if(!edited) return;

    const team1Sum = values[team1].points + values[team1].declarations;
    const team2Sum = values[team2].points + values[team2].declarations;


    if(team1Sum < team2Sum && values[team1].points !== 0) setFallSuggestion([team1]);
    else if(team2Sum < team1Sum && values[team2].points !== 0) setFallSuggestion([team2]);
    else if(team2Sum === team1Sum && values[team1].points !== 0 && values[team2].points !== 0) setFallSuggestion([team1, team2]);
    else setFallSuggestion([]);
  }, [edited, values, team1, team2]);

  const updateState = useCallback ((state: Round) => {
    if(playerCount !== 4) return state;

    const otherTeam = selected.team === team1 ? team2 : team1;
    return {
      ...state,
      [otherTeam]: {
        ...state[otherTeam],
        points: Math.max(0, 162 - state[selected.team].points)
      }
    }
  }, [playerCount, selected, team1, team2]);

  const setValue = useCallback((digit: number) => {
    if(Math.floor(values[selected.team][selected.input]/100) !== 0) return;

    setFallen(undefined);
    setEdited(true);
    setValues(curr => {
      const newState = updateState({
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: curr[selected.team][selected.input]*10 + digit
        }
      });

      return newState;
    });
  }, [selected, updateState, values]);

  const clear = useCallback(() => {
    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: 0
      }
    }));
  }, [selected, updateState]);

  const backspace = useCallback(() => {

    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: Math.floor(curr[selected.team][selected.input] / 10)
      }
    }));
  }, [selected, updateState]);

  const end = useCallback(() => {
    if(totalPoints() > 162) {
      setError("Can't enter more then 162 points");

      return;
    }

    for(const team of [team1, team2]) {
      if(values[team].points === 0) {
        values[team].declarations = 0;
        continue;
      }
    }

    pointsReport(values);
  }, [pointsReport, team1, team2, totalPoints, values]);

  function fall(team: string) {
    setFallen(team);
    setFallSuggestion([]);
    setValues(curr => {
      const newValues = {...curr};
      const otherTeam = team === team1 ? team2 : team1;

      newValues[otherTeam].points += newValues[team].points;
      newValues[otherTeam].declarations += newValues[team].declarations;
      newValues[team].points = 0;
      newValues[team].declarations = 0;

      return newValues;
    })
  }

  const suggestions: {[key: string]: Sugestion} = {};
  for(const team of [team1, team2]) {
    if(fallSuggestion.includes(team)) {
      suggestions[team] = {
        text: "fall?",
        callback: () => fall(team)
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
      teams={[team1, team2]}
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