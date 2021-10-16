import RoundEntry from "./RoundEntry";
import { useContext, useEffect, useState } from 'react';
import ScoreBoard from '../views/ScoreBoard';
import { GlobalState } from '../../../App';
import { Round } from "../../../interfaces";
import Winner from '../views/Winner';
import { useHistory } from 'react-router';
import Dealer from '../views/Dealer';

const Game: React.FC = () => {
  const { getState, editDealer, editRound, enterRound, restart, deleteRound } = useContext(GlobalState);
  const { dealer, players, playerCount, rounds, teams, winner, scoreTarget } = getState();

  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [selectedRound, setSelectedRound] = useState<number>(rounds.length - 1);
  const [resetRequest, setResetRequest] = useState<boolean>(false);
  const [dealerEdit, setDealerEdit] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => setSelectedRound(rounds.length - 1), [rounds]);

  
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
    <>
      <main className="text-right text-white overflow-x-hidden">
        {editIndex === undefined ? ( 
          <ScoreBoard 
            lastSumIndex={selectedRound}
            roundActions={[
                {name: 'Edit', action: (index: number) => setEditIndex(index)}, 
                {name: 'Rewind', action: (index: number) => setSelectedRound(index)},
                {name: 'Delete', action: (index: number) => deleteRound(index)}
              ]}
            rounds={rounds}
            scoreTarget={scoreTarget}
            setEditIndex={setEditIndex}
            teams={teamNames}
          />
        ) : (
          <RoundEntry
            teamOnCall={teamOnCall!}
            teams={teamNames}
            playerCount={playerCount!}
            cancel={() => setEditIndex(undefined)}
            pointsReport={(round: Round) => pointsReport(round, editIndex!)}
            playerPoints={rounds[editIndex!]}
          />
        )}
        <Dealer
          dealer={dealer!}
          setDealer={setDealer}
          dealerEdit={dealerEdit}
          editModeToggle={() => setDealerEdit(curr => !curr)}
          players={players}
        />
        {/* <button
          onClick={() => setEditIndex(rounds.length)}
          // variant="contained"
          // color="primary"
          // fullWidth
          // size="large"
        >
          Enter round
        </button>
        <button
          onClick={() => setResetRequest(true)}
          style={{marginTop: '0.5em'}}
          // fullWidth
          // size="small"
        >
          Reset
        </button> */}
        {winner && (
          <Winner newGame={() => history.push('/setup')} rematch={restart} winner={winner!} />
        )}
        {/* <Dialog
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
        </Dialog> */}
      </main>
    </>
  );
};

export default Game;