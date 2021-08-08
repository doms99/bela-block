import { Button, Card, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import RoundEntry from './RoundEntry';
import '../../styles/Game.css';
import { useContext, useState } from 'react';
import ScoreBoard from './ScoreBoard';
import { GlobalState, RoundType } from '../../App';
import Winner from './Winner';
import { useHistory } from 'react-router';

const Game: React.FC = () => {
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [resetRequest, setResetRequest] = useState(false);
  const history = useHistory();

  const { getState, editRound, enterRound, restart } = useContext(GlobalState);

  const { dealer, players, playerCount, rounds, teams, winner, scoreTarget } = getState();

  const pointsReport = (round: RoundType, index: number) => {
    if(index === rounds.length) enterRound(round);
    else editRound(round, index);

    setEditIndex(undefined);
  }

  const handleReset = (toReset: boolean) => {
    if(toReset) restart();

    setResetRequest(false);
  }

  const teamNames = teams ? teams.map(team => team.name) : players;  

  return (
    <Container style={{textAlign: 'center'}}>
      <ScoreBoard
        teams={teamNames}
        scoreTarget={scoreTarget}
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
        Enter round
      </Button>
      <Button
        onClick={() => setResetRequest(true)}
        style={{margin: '1em'}}
        variant="contained"
        color="secondary"
      >
        Reset
      </Button>
      {editIndex !== undefined && (
        <RoundEntry
          teams={teamNames}
          playerCount={playerCount!}
          cancel={() => setEditIndex(undefined)}
          pointsReport={(round: RoundType) => pointsReport(round, editIndex)}
          playerPoints={rounds[editIndex]}
        />
      )}
      {winner && (
        <Winner newGame={() => history.push('/setup')} rematch={restart} winner={winner!} />
      )}
      <Dialog
        open={resetRequest}
        onClose={() => handleReset(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure tou want to reset the match?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleReset(true)} color="primary">
            Yes
          </Button>
          <Button onClick={() => handleReset(false)} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Game;