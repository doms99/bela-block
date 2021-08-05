import { Button, Card, CardContent, CardHeader, Container, IconButton, Typography } from '@material-ui/core';
import RoundEntry from './RoundEntry';
import '../styles/Game.css';
import { useEffect, useState } from 'react';
import ScoreBoard from './ScoreBoard';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export interface Props {
  players: string[]
}

const generateRandomPoints = (num: number): number[] => {
  const result: number[] = [];

  if(num <= 0) return result;

  let counter = 0;
  while(counter < num) {
    result.push(Math.round(Math.random() * 200));
    counter++
  }

  return result;
}

const Game: React.FC<Props> = ({ players }) => {
  const [playerScores, setPlayerScores] = useState<Record<string, {points: number[], declarations: number[]}>>(
    players.reduce((obj, player) => ({...obj, [player]: {
      points: generateRandomPoints(4), 
      declarations: [20, 0, 0, 100]}
    }), {}));
  const [roundNum, setRoundNum] = useState<number>(5);
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [dealing, setDealing] = useState<number>(Math.floor(Math.random() * (players.length - 1)));

  // useEffect(() => {
  //   for(Object.keys)
  //   if(sumOfPoints(pla))
  // }, [playerScores]);

  useEffect(() => {
    setDealing(curr => (curr + 1) % players.length)
  }, [roundNum, players]);

  const pointsReport = (roundPoints: Record<string, {points: number, declarations: number}>, index: number) => {
    setEditIndex(undefined);

    if(index + 1 === roundNum) setRoundNum(curr => curr + 1);

    setPlayerScores(curr => {
      const newPoints = {...curr};

      for(let [player, round] of Object.entries(newPoints)) {
        round.points[index] = roundPoints[player].points;
        round.declarations[index] = roundPoints[player].declarations;
      }

      return newPoints;
    });
  }

  return (
    <Container style={{textAlign: 'center', height: '100vh'}}>
      <ScoreBoard playerScores={playerScores} setEditIndex={setEditIndex}/>
      <Card style={{margin: '1em 0'}}>
        <CardHeader 
          style={{textAlign: 'left', color: 'gray', paddingBottom: 0, paddingTop: '8px'}}
          title="Dealer"
          titleTypographyProps={{variant: 'subtitle1'}}
        />
        <CardContent className="horizontal">
          {players.map((player, index) => <Typography key={player} style={{color: dealing === index ? "black" : "gray"}} variant={dealing === index ? "h4" : "h5"}>{player}</Typography>)}
        </CardContent>
      </Card>
      <Button onClick={() => setEditIndex(roundNum - 1)} style={{margin: '1em'}} variant="contained" color="primary">New round</Button>
      {editIndex !== undefined && (
        <RoundEntry
          players={players}
          cancel={() => setEditIndex(undefined)}
          pointsReport={(round: Record<string, {points: number, declarations: number}>) => pointsReport(round, editIndex)}
          playerPoints={
            Object.entries(playerScores).reduce(
              (obj, [player, round]) => ({...obj, [player]: roundNum === editIndex + 1 ? {points: 0, declarations: 0} : {points: round.points[editIndex], declarations: round.declarations[editIndex]}}), {})
          }
        />
      )}
    </Container>
  );
};

export default Game;