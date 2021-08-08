import { Button, Card, CardContent, CardHeader, Container, Typography } from '@material-ui/core';
import RoundEntry from './RoundEntry';
import '../../styles/Game.css';
import { useContext, useEffect, useState } from 'react';
import ScoreBoard from './ScoreBoard';
import { GlobalState } from '../../App';
import Winner from './Winner';
import { useHistory } from 'react-router';

const Game: React.FC = () => {
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [winner, setWinner] = useState<string | undefined>();
  const history = useHistory();

  const { getState, editRound, enterRound, rematch } = useContext(GlobalState);

  const { dealer, players, playerCount, rounds, teams } = getState();

  useEffect(() => {
    if(!playerCount) return;

    const score: Record<string, number> = {};

    players.forEach(name => score[name] = 0);

    let names: string[];
    if(playerCount === 4 && teams) {
      names = [`${teams[0][0]} and ${teams[0][1]}`, `${teams[1][0]} and ${teams[1][1]}`];
    } else {
      names = players;
    } 

    names.forEach(name => rounds.forEach(round => score[name] += round[name].points));

    for(const [player, points] of Object.entries(score)) {
      if(playerCount === 2 && points > 501) {
        setWinner(player);
        return;
      }

      if(playerCount === 3 && points > 701) {
        setWinner(player);
        return;
      }

      if(playerCount === 4 && points > 1001) {
        setWinner(player);
        return;
      }
    }
    
  }, [players, rounds, playerCount, teams]);

  const pointsReport = (round: Record<string, {points: number, declarations: number}>, index: number) => {
    if(index === rounds.length) enterRound(round);
    else editRound(round, index);

    setEditIndex(undefined);
  }

  const newGame = () => {
    history.push('/setup');
  }

  return (
    <Container style={{textAlign: 'center', height: '100vh'}}>
      <ScoreBoard
        teams={teams ? 
          [`${teams[0][0]} and ${teams[0][1]}`, `${teams[1][0]} and ${teams[1][1]}`] : 
          players  
        }
        rounds={rounds}
        setEditIndex={setEditIndex}
      />
      <Card style={{margin: '1em 0'}}>
        <CardHeader 
          style={{textAlign: 'left', color: 'gray', paddingBottom: 0, paddingTop: '8px'}}
          title="Dealer"
          titleTypographyProps={{variant: 'subtitle1'}}
        />
        <CardContent className="horizontal">
          {players.map((player) => <Typography key={player} style={{color: dealer === player ? "black" : "gray"}} variant={dealer === player ? "h4" : "h5"}>{player}</Typography>)}
        </CardContent>
      </Card>
      <Button
        onClick={() => setEditIndex(rounds.length)}
        style={{margin: '1em'}}
        variant="contained"
        color="primary"
      >
        New round
      </Button>
      {/* <Button
        onClick={() => setEditIndex(rounds.length)}
        style={{margin: '1em'}}
        variant="contained"
        color="secondary"
      >
        New Game
      </Button> */}
      {editIndex !== undefined && (
        <RoundEntry
          players={teams ? 
            [`${teams[0][0]} and ${teams[0][1]}`, `${teams[1][0]} and ${teams[1][1]}`] : 
            players  
          }
          playerCount={playerCount!}
          cancel={() => setEditIndex(undefined)}
          pointsReport={(round: Record<string, {points: number, declarations: number}>) => pointsReport(round, editIndex)}
          playerPoints={rounds[editIndex]}
        />
      )}
      {winner && (
        <Winner newGame={newGame} rematch={rematch} winners={winner!.split('and')} />
      )}
    </Container>
  );
};

export default Game;