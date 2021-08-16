import { Button, Card, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Typography, useMediaQuery } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import RoundEntry from './RoundEntry';
import '../../styles/Game.css';
import { useContext, useState } from 'react';
import ScoreBoard from './ScoreBoard';
import { GlobalState, Round } from '../../App';
import Winner from './Winner';
import { useHistory } from 'react-router';

const Game: React.FC = () => {
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [resetRequest, setResetRequest] = useState<boolean>(false);
  const [dealerEdit, setDealerEdit] = useState<boolean>(false);
  const history = useHistory();
  const phoneSize = useMediaQuery('(max-width: 600px)');

  const { getState, editDealer, editRound, enterRound, restart } = useContext(GlobalState);

  const { dealer, players, playerCount, rounds, teams, winner, scoreTarget } = getState();

  const pointsReport = (round: Round, index: number) => {
    if(index === rounds.length) enterRound(round);
    else editRound(round, index);

    setEditIndex(undefined);
  }

  const setDealer = (player: string) => {
    if(!dealerEdit) return;
    
    editDealer(player);
    setDealerEdit(false);
  }

  const handleReset = (toReset: boolean) => {
    if(toReset) restart();

    setResetRequest(false);
  }

  const teamNames = teams ? teams.map(team => team.name) : players;
  const teamOnCall = playerCount !== 3? 
    undefined :
    players[(players.indexOf(dealer!) + 1 - (rounds.length - editIndex!) % playerCount!) % playerCount!];

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
          style={{textAlign: 'left', color: 'gray'}}
          title="Dealer"
          action={dealerEdit ? (
            <IconButton onClick={() => setDealerEdit(false)} aria-label="settings">
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton onClick={() => setDealerEdit(true)} aria-label="settings">
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          titleTypographyProps={{variant: 'subtitle1'}}
        />
        <CardContent className={playerCount === 4 && phoneSize ? "grid-2" : "horizontal"}>
          {players.map((player) => (
            <Typography
              key={player}
              style={{color: dealer === player || dealerEdit ? "black" : "gray", cursor: dealerEdit ? 'pointer' : 'inherit'}}
              variant={dealer === player || dealerEdit ? "h4" : "h5"}
              onClick={() => setDealer(player)}
            >
              {player}
            </Typography>
          )
        )}
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
          teamOnCall={teamOnCall!}
          teams={teamNames}
          playerCount={playerCount!}
          cancel={() => setEditIndex(undefined)}
          pointsReport={(round: Round) => pointsReport(round, editIndex)}
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