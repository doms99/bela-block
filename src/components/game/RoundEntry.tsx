import { Button, Card, CardActions, CardContent, Divider, Paper, Typography } from "@material-ui/core";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useCallback, useEffect, useState } from "react";

export interface Props {
  players: string[],
  playerPoints?: Record<string, {points: number, declarations: number}>,
  pointsReport: (round: Record<string, {points: number, declarations: number}>) => void,
  playerCount: number,
  cancel: () => void
}

const zeroValues = (players: string[]) => {
  return players.reduce((obj, player) => ({...obj, [player]: { points: 0, declarations: 0 }}), {});
}

const RoundEntry: React.FC<Props> = ({ players, playerPoints, playerCount, pointsReport, cancel }) => {
  const [values, setValues] = useState<Record<string, {points: number, declarations: number}>>(playerPoints ? playerPoints : zeroValues(players));
  const [selected, setSelected] = useState<{player: string, input: 'points' | 'declarations'}>({player: players[0], input: 'points'});
  const [error, setError] = useState<string | undefined>();

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
    if(playerCount !== 4) return;

    const otherPlayer = players.filter(name => name !== selected.player)[0];

    setValues(curr => ({
      ...curr,
      [otherPlayer]: {
        ...curr[otherPlayer],
        points: 162 - curr[selected.player].points
      }
    }))
  }, [playerCount, players, selected]);

  const setPoints = (digit: number) => {
    if(Math.floor(values[selected.player][selected.input]/100) !== 0) return;

    setValues(curr => ({
      ...curr,
      [selected.player]: {
        ...curr[selected.player],
        [selected.input]: curr[selected.player][selected.input]*10 + digit
      }
    }))
  }

  const clear = () => {
    setValues(curr => ({
      ...curr,
      [selected.player]: {
        ...curr[selected.player],
        [selected.input]: 0
      }
    }))
  }

  const backspace = () => {
    setValues(curr => ({
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
      <Card className="absolute-center">
        <CardContent>
          <div className="horizontal" style={{marginBottom: '0.5em'}}>
            {players.map((player) => 
              <Paper
                style={{flexGrow: 1, padding: '0.5em', margin: '0 0.5em', width: '33.33%', color: 'gray'}}
                key={player}
                elevation={player === selected.player ? 4 : 1}
              >
                <div style={{color: selected.player === player && selected.input === 'points' ? 'black' : 'inherit'}} onClick={() => setSelected({player,  input: 'points'})}>
                  {values[player].points}
                </div>
                <Divider />
                <div style={{color: selected.player === player && selected.input === 'declarations' ? 'black' : 'inherit'}} onClick={() => setSelected({player,  input: 'declarations'})}>
                  {values[player].declarations}
                </div>
              </Paper>
            )}
          </div>
          <Typography style={{color: error ? 'red' : 'white'}}>{error ? error : 'i'}</Typography>
          <div className="grid">
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