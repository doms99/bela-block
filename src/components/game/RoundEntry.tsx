import { Button, Card, CardActions, CardContent, Divider, Paper, Typography } from "@material-ui/core";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useCallback, useEffect, useState } from "react";
import { Round } from "../../App";

interface Bonus {
  [key: string]: {
    value: number,
    confirmed: boolean
  }
}

export interface Props {
  teams: string[],
  playerPoints?: Round,
  pointsReport: (round: Round) => void,
  playerCount: number,
  cancel: () => void,
  teamOnCall?: string
}

const zeroValues = (players: string[]) => {
  return players.reduce((obj, player) => ({...obj, [player]: { points: 0, declarations: 0 }}), {});
}

const zeroBonuses = (teams: string[]) => {
  const result: Bonus = {};

  teams.forEach(team => result[team] = {value: 0, confirmed: false});

  return result;
}

const adjustPlayerPoints = (playerPoints: Round): [Round, Bonus] => {
  const bonuses = zeroBonuses(Object.keys(playerPoints));
  const newPlayerPoints: Round = {};

  for(const [team, round] of Object.entries(playerPoints)) {
    newPlayerPoints[team] = {...round};
    if(round.points === 162) {
      newPlayerPoints[team].declarations -= 80;
      bonuses[team] = {value: 80, confirmed: true};
    }
  }

  return [newPlayerPoints, bonuses];
} 

const pointOnCallStyle = {border: '2px solid'}

const RoundEntry: React.FC<Props> = ({ teams, teamOnCall, playerPoints, playerCount, pointsReport, cancel }) => {
  const [playerPointsAdjusted, bonusesCalculated] = playerPoints ? adjustPlayerPoints(playerPoints) : [zeroValues(teams), zeroBonuses(teams)];
  
  const [values, setValues] = useState<Round>(playerPointsAdjusted);
  const [selected, setSelected] = useState<{player: string, input: 'points' | 'declarations'}>({player: teams[0], input: 'points'});
  const [error, setError] = useState<string | undefined>();
  const [pass, setPass] = useState<boolean | undefined>(undefined);
  const [edited, setEdited] = useState<boolean[]>(teams.map(team => !playerPoints || team === teamOnCall ? false : true));
  const [bonuses, setBonuses] = useState<Bonus>(bonusesCalculated);
  const [fallSuggestion, setFallSuggestion] = useState<boolean[]>(teams.map(_ => false));
  const [fallen, setFallen] = useState<string | undefined>();

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
    if(!!fallen) return;

    for(const team of teams) {
      if(values[team].points === 162) {
        setBonuses(curr => ({...curr, [team]: {value: 80, confirmed: playerCount === 3 ? true : false}}));
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

    if(otherTeamsPoints === 162) {
      setPass(false);
      return;
    }

    if(edited.reduce((val, status) => status ? val : val+1, 0) !== 1) return;

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
    uneditedPlayerPoints += state[uneditedPlayer].declarations;
    const rest = teams.filter(team => team !== uneditedPlayer);
    const sumOfRest = rest.reduce((sum, name) => sum += state[name].points + state[name].declarations, 0);

    if(uneditedPlayer === teamOnCall && sumOfRest >= uneditedPlayerPoints) {
      return {
        ...state,
        [uneditedPlayer]: {
          ...state[uneditedPlayer],
          points: 0
        }
      }
    }
    
    return {
      ...state,
      [uneditedPlayer]: {
        ...state[uneditedPlayer],
        points: Math.max(0, 162 - teams.filter(name => name !== uneditedPlayer).reduce((val, name) => val += state[name].points, 0))
      }
    }
  }

  const updateState_4 = (state: Round) => {
    if(playerCount === 2) return state;
    if(selected.input === 'declarations') return state;

    const otherPlayers = teams.filter(name => name !== selected.player);

    return {
      ...state,
      [otherPlayers[0]]: {
        ...state[otherPlayers[0]],
        points: Math.max(162 - state[selected.player].points, 0)
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

  const setPoints = (digit: number) => {
    if(Math.floor(values[selected.player][selected.input]/100) !== 0) return;
    
    let passedEdited: boolean[] = edited;
    if(selected.input === 'points') {
      setEdited(curr => {
        const newEdited = [...curr];
        newEdited[teams.indexOf(selected.player)] = true;
  
        passedEdited = newEdited;
        return newEdited;
      })
    }

    setFallen(undefined);

    setValues(curr => {
      const newState = {
        ...curr,
        [selected.player]: {
          ...curr[selected.player],
          [selected.input]: curr[selected.player][selected.input]*10 + digit
        }
      }

      return updateState(newState, passedEdited);
    })
  }

  const clear = () => {
    if(values[selected.player][selected.input] !== 0) setFallen(undefined);
    
    setValues(curr => updateState({
      ...curr,
      [selected.player]: {
        ...curr[selected.player],
        [selected.input]: 0
      }
    }, edited))
  }

  const backspace = () => {
    if(values[selected.player][selected.input] !== 0) setFallen(undefined);

    setValues(curr => updateState({
      ...curr,
      [selected.player]: {
        ...curr[selected.player],
        [selected.input]: Math.floor(curr[selected.player][selected.input] / 10)
      }
    }, edited))
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

  const borderColor = pass === undefined ? 'gray' : pass ? 'green' : 'red';
  const status = pass === undefined ? 'call' : pass ? 'pass' : 'fail';
  const grid = teams.length === 3 ? "points-grid-3" : "points-grid-2";

  return (
    <div className="before">
      <Card className="absolute-card">
        <CardContent>
          <div className={grid}>
            {teams.map(name => <Typography key={name}>{name}</Typography>)}
          </div>
          <div className="horizontal" style={{marginBottom: '0.5em'}}>
            {teams.map((team, index) => 
              <Paper
                className="points-enter"
                key={team}
                elevation={team === selected.player ? 4 : 1}
                style={team === teamOnCall ? 
                  {...pointOnCallStyle,
                    position: 'relative',
                    borderColor
                  } : fallen === team ? 
                    {position: 'relative', ...pointOnCallStyle, borderColor: 'red'} : 
                    {position: 'relative'}
                }
              >
                {(teamOnCall === team || fallen === team) && (
                  <div style={{borderRadius: '0 5px', position: 'absolute', right: -1, top: -1, padding: '4px 8px', color: 'white', backgroundColor: playerCount === 3 ? borderColor : 'red'}}>
                    <Typography style={{fontSize: '0.8em'}}>{playerCount ===3 ? status : 'fail'}</Typography>
                  </div>
                )}
                {!!bonuses[team].value && (
                  <Paper
                    elevation={2}
                    style={{cursor: 'pointer',color: bonuses[team].confirmed ? 'inherit' : 'lightgray', position: 'absolute', right: '-0.5em', top: '50%', transform: 'translateY(-50%)', padding: '4px 6px'}}
                    onClick={() => setBonuses(curr => ({...curr, [team]: {...curr[team], confirmed: !curr[team].confirmed}}))}
                  >
                    <Typography>+{bonuses[team].value}</Typography>
                    <Typography style={{fontSize: '0.6em', marginTop: '-0.8em'}}>bonus</Typography>
                  </Paper>
                )}
                {fallSuggestion[index] && (
                  <Paper
                    elevation={2}
                    style={{cursor: 'pointer', position: 'absolute', right: '-0.5em', top: '50%', transform: 'translateY(-50%)', padding: '4px 6px'}}
                    onClick={() => fall(team)}
                  >
                    <Typography>fall?</Typography>
                  </Paper>
                )}
                <div style={{
                  color: selected.player === team && selected.input === 'points' ? 'black' : 'inherit'}}
                  onClick={() => setSelected({player: team,  input: 'points'})}
                >
                  <Typography
                    style={{
                      textAlign: 'left',
                      color: selected.player === team && selected.input === 'points' ? 'black' : 'gray',
                      fontSize: '0.8em'
                    }}
                  >
                    Points
                  </Typography>
                  <Typography
                    style={{
                      fontSize: '1.2em',
                      color: selected.player === team && selected.input === 'points' ? 'black' : 'gray',
                      marginBottom: '4px'
                    }}
                  >
                    {values[team].points}
                  </Typography>
                </div>
                <div className="horizontal">
                  <Divider style={{flexGrow: 1, marginRight: '0.4em'}} />
                  <Typography style={{fontSize: '0.8em'}}>
                    {team === teamOnCall && pass === false ? 0 :
                      values[team].points+values[team].declarations+(bonuses[team].confirmed ? bonuses[team].value : 0)}
                  </Typography>
                  <Divider style={{flexGrow: 1, marginLeft: '0.4em'}}/>
                </div>
                <div
                  onClick={() => setSelected({player: team,  input: 'declarations'})}
                >
                  <Typography
                    style={{
                      fontSize: '1.2em',
                      color: selected.player === team && selected.input === 'declarations' ? 'black' : 'gray',
                      marginTop: '4px'
                    }}
                  >
                    {values[team].declarations}
                  </Typography>
                  <Typography
                    style={{
                      textAlign: 'left',
                      color: selected.player === team && selected.input === 'declarations' ? 'black' : 'gray',
                      fontSize: '0.8em'
                    }}
                  >
                    Declarations
                  </Typography>
                </div>
              </Paper>
            )}
          </div>
          <Typography style={{color: error ? 'red' : 'white'}}>{error ? error : 'i'}</Typography>
          <div className="grid num-pad">
            <Button onClick={() => setPoints(1)}>1</Button>
            <Button onClick={() => setPoints(2)}>2</Button>
            <Button onClick={() => setPoints(3)}>3</Button>
            <Button onClick={() => setPoints(4)}>4</Button>
            <Button onClick={() => setPoints(5)}>5</Button>
            <Button onClick={() => setPoints(6)}>6</Button>
            <Button onClick={() => setPoints(7)}>7</Button>
            <Button onClick={() => setPoints(8)}>8</Button>
            <Button onClick={() => setPoints(9)}>9</Button>
            <Button onClick={backspace}><KeyboardBackspaceIcon/></Button>
            <Button onClick={() => setPoints(0)}>0</Button>
            <Button onClick={clear}>clear</Button>
          </div>
        </CardContent>
        <CardActions className="horizontal">
          <Button onClick={cancel} variant="contained" color="secondary">Cancel</Button>
          <Button disabled={!!error || Object.values(values).reduce((acc, value) => acc+value.points, 0) === 0} onClick={end} variant="contained" color="primary">Save</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default RoundEntry;