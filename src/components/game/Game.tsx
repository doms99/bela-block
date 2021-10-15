import RoundEntry from './RoundEntry';
import { useContext, useEffect, useState } from 'react';
import ScoreBoard from './ScoreBoard';
import { GlobalState, Round } from '../../App';
import Winner from './Winner';
import { useHistory } from 'react-router';
import TotalPoints from './TotalPoints';
import EditIcon from '../icons/EditIcon';
import AddIcon from '../icons/AddIcon';
import RoundPoints from './RoundPoints';
import CancelIcon from '../icons/CancelIcon';

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
        <div className="green-backdrop">
          <section className={`grid grid-cols-${teamNames.length} ml-10 mr-10 mb-8`}>
            {teamNames.map(name => (
              <TotalPoints
                key={name}
                points={rounds.slice(0, selectedRound+1).reduce(
                  (sum, round) => sum + round[name].declarations + round[name].points, 0)
                }
                scoreTarget={scoreTarget}
              />
            ))}
          </section>
          <section className="text-center bg-white text-black pt-6 ml-16 pb-10 h-50vh rounded-b-ellipse rounded-t-5xl mr-16 overflow-x-hidden overflow-y-auto">
            {/* <div className={`grid bg-transparent grid-cols-${teamNames.length} text-xl font-medium`} > */}
              {[...rounds].reverse().map((round, i) => {
                const index = rounds.length - 1 - i;
                return <RoundPoints 
                  key={index}
                  onClickOptions={[
                    {name: 'Edit', action: () => setEditIndex(index)}, 
                    {name: index <= selectedRound ? 'Rewind' : 'Advance', action: () => setSelectedRound(index)},
                    {name: 'Delete', action: () => deleteRound(index)}
                  ]}
                  round={round}
                  teams={teamNames}
                  selected={index <= selectedRound}
                />
              })}
            {/* </div> */}
          </section>
          <div className="w-full -mt-10 h-24 flex justify-between">
            <div />
            <div className="mr-28 w-24 h-24">
              <button
                className="outlined-bnt text-primary hover:text-primary-active"
                onClick={() => setEditIndex(rounds.length)}
              >
                <AddIcon className="w-4/6 m-auto" />
              </button>
            </div>
          </div>
          <section>

          </section>
        </div>
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
        <section className={`absolute text-center bottom-0 w-full grid grid-cols-${players.length}`}>
          {players.map((player) => (
            <button
              key={player}
              className={`font-bold text-2xl ${dealer === player || dealerEdit ? "text-black" : "text-primary-active"}`}
              // variant={dealer === player || dealerEdit ? "h4" : "h5"}
              onClick={() => setDealer(player)}
            >
              {player}
            </button>
            )
          )}
          <button 
            className={`rounded-b-none mt-2 rounded-t-full bg-primary w-16 h-8 col-start-${players.indexOf(dealer!)+1} m-auto`}
            onClick={() => setDealerEdit(curr => !curr)}
          >
            {dealerEdit ? <CancelIcon className="w-3 m-auto mt-1" /> : <EditIcon className="w-3 m-auto mt-1" />}
          </button>
        </section>
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
        {/* {editIndex !== undefined && (
          <RoundEntry
            teamOnCall={teamOnCall!}
            teams={teamNames}
            playerCount={playerCount!}
            cancel={() => setEditIndex(undefined)}
            pointsReport={(round: Round) => pointsReport(round, editIndex)}
            playerPoints={rounds[editIndex]}
          />
        )} */}
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