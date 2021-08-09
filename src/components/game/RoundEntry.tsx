import { Button, Card, CardActions, CardContent, Divider, Paper, Typography } from "@material-ui/core";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useCallback, useEffect, useState } from "react";
import { RoundType } from "../../App";

export interface Props {
  teams: string[],
  playerPoints?: RoundType,
  pointsReport: (round: RoundType) => void,
  playerCount: number,
  cancel: () => void
}

const zeroValues = (players: string[]) => {
  return players.reduce((obj, player) => ({...obj, [player]: { points: 0, declarations: 0 }}), {});
}

const RoundEntry: React.FC<Props> = ({ teams, playerPoints, playerCount, pointsReport, cancel }) => {
  const [values, setValues] = useState<RoundType>(playerPoints ? playerPoints : zeroValues(teams));
  const [selected, setSelected] = useState<{player: string, input: 'points' | 'declarations'}>({player: teams[0], input: 'points'});
  const [error, setError] = useState<string | undefined>();
  const [edited, setEdited] = useState<boolean[]>(teams.map(_ => false));

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
    setEdited(curr => {
      const newEdited = [...curr];
      newEdited[teams.indexOf(selected.player)] = true;

      return newEdited;
    })
  }, [selected, teams]);

  const updateState = (state: RoundType) => {
    if(playerCount === 2) return state;

    const otherPlayers = teams.filter(name => name !== selected.player);

    if(playerCount === 3) {    
      if(edited.reduce((val, status) => status ? val : val+1, 0) !== 1) return state;

      const uneditedPlayer = teams[edited.indexOf(false)];
      
      return {
        ...state,
        [uneditedPlayer]: {
          ...state[uneditedPlayer],
          points: Math.max(0, 162 - teams.filter(name => name !== uneditedPlayer).reduce((val, name) => val += state[name].points, 0))
        }
      }
    }

    return {
      ...state,
      [otherPlayers[0]]: {
        ...state[otherPlayers[0]],
        points: Math.max(162 - state[selected.player].points, 0)
      }
    };
  }

  const setPoints = (digit: number) => {
    if(Math.floor(values[selected.player][selected.input]/100) !== 0) return;

    setValues(curr => {
      const newState = {
        ...curr,
        [selected.player]: {
          ...curr[selected.player],
          [selected.input]: curr[selected.player][selected.input]*10 + digit
        }
      }

      return updateState(newState);
    })
  }

  const clear = () => {
    setValues(curr => updateState({
      ...curr,
      [selected.player]: {
        ...curr[selected.player],
        [selected.input]: 0
      }
    }))
  }

  const backspace = () => {
    setValues(curr => updateState({
      ...curr,
      [selected.player]: {
        ...curr[selected.player],
        [selected.input]: Math.floor(curr[selected.player][selected.input] / 10)
      }
    }))
  }

  const end = () => {
    if(playerCount > 2 && calcPoints() !== 162) {
      setError("Sum of points doesn't equal 162");

      return;
    }

    pointsReport(values);
  }

  return (
    <div className="before">
      <Card className="absolute-card">
        <CardContent>
          <div className="horizontal">
            {teams.map(name => <Typography key={name}>{name}</Typography>)}
          </div>
          <div className="horizontal" style={{marginBottom: '0.5em'}}>
            {teams.map((player) => 
              <Paper
                className="points-enter"
                key={player}
                elevation={player === selected.player ? 4 : 1}
              >
                <div style={{
                  color: selected.player === player && selected.input === 'points' ? 'black' : 'inherit'}}
                  onClick={() => setSelected({player,  input: 'points'})}
                >
                  <Typography
                    style={{
                      fontSize: '1.2em',
                      color: selected.player === player && selected.input === 'points' ? 'black' : 'gray',
                      marginBottom: '4px'
                    }}
                  >
                    {values[player].points
                  }</Typography>
                </div>
                <Divider />
                <div
                  onClick={() => setSelected({player,  input: 'declarations'})}
                >
                  <Typography
                    style={{
                      fontSize: '1.2em',
                      color: selected.player === player && selected.input === 'declarations' ? 'black' : 'gray',
                      marginTop: '4px'
                    }}
                  >
                    {values[player].declarations}
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
          <Button disabled={!!error || Object.values(values).reduce((acc, value) => acc+value.points, 0) === 0} onClick={end} variant="contained" color="primary">Save</Button>
          <Button onClick={cancel} variant="contained" color="secondary">Cancel</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default RoundEntry;