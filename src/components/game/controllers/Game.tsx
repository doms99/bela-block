import RoundEntry from "./RoundEntry";
import React, { useContext, useEffect, useState } from 'react';
import ScoreBoard from '../views/ScoreBoard';
import { GlobalState } from '../../../App';
import { Round } from "../../../interfaces";
import Winner from '../views/Winner';
import { useHistory } from 'react-router';
import Dealer from '../views/Dealer';

const GameComp: React.FC = () => {
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
  const teamOnCall = playerCount !== 3 ? 
    undefined :
    players[(players.indexOf(dealer!) + 1) % playerCount];

  return (
    <>
      <main className="relative h-full text-right text-white overflow-x-hidden">
        {teamNames.length === 3 && !!teamOnCall ? (
          <div className="absolute top-0 w-full px-6 grid grid-cols-3 ">
            <div className={`rounded-b-full w-8 h-4 m-auto bg-white col-start-${teamNames.indexOf(teamOnCall)+1}`} />
          </div>
        ) : undefined}
        {winner && (
          <Winner 
            newGame={() => history.push('/setup')}
            rematch={restart}
            winner={winner!}
            deleteLast={() => deleteRound(rounds.length-1)}
          />
        )}
        <div className="green-backdrop h-3/4 flex flex-col">
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
        </div>
        <Dealer
          dealer={dealer!}
          setDealer={setDealer}
          dealerEdit={dealerEdit}
          editModeToggle={() => setDealerEdit(curr => !curr)}
          players={players}
        />
      </main>
    </>
  );
};

const Game = React.memo(GameComp);
export default Game;