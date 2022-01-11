import RoundEntry3 from "./RoundEntry3";
import RoundEntry2 from "./RoundEntry2";
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import ScoreBoard from '../views/ScoreBoard';
import { GlobalState } from '../../../App';
import { Round } from "../../../interfaces";
import Winner from '../views/Winner';
import { useHistory } from 'react-router';
import Dealer from '../views/Dealer';

const Game: React.FC = () => {
  const { getState, editDealer, editRound, enterRound, restart, deleteRound } = useContext(GlobalState);
  const { dealer, players, rounds, teams, winner, scoreTarget } = getState();

  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [selectedRound, setSelectedRound] = useState<number>(rounds.length - 1);
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

  const teamNames = teams ? teams.map(team => team.name) : players;
  const teamOnCall = players.length !== 3 ? 
    undefined :
    players[(players.indexOf(dealer!) + 1) % players.length];

  let roundEntry: ReactElement | undefined = undefined;
  switch(players.length) {
    case 2: {
      roundEntry = <RoundEntry2
        team1={teamNames[0]}
        team2={teamNames[1]}
        playerCount={players.length}
        teamPoints={rounds[editIndex!]}
        cancel={() => setEditIndex(undefined)}
        pointsReport={(round: Round) => pointsReport(round, editIndex!)}
      />;
      break;
    }
    case 3: {
      roundEntry = <RoundEntry3
        teamOnCall={teamOnCall!}
        team1={teamNames[0]}
        team2={teamNames[1]}
        team3={teamNames[2]}
        teamPoints={rounds[editIndex!]}
        cancel={() => setEditIndex(undefined)}
        pointsReport={(round: Round) => pointsReport(round, editIndex!)}
      />;
      break;
    }
    case 4: {
      roundEntry = <RoundEntry2
        team1={teamNames[0]}
        team2={teamNames[1]}
        playerCount={players.length}
        teamPoints={rounds[editIndex!]}
        cancel={() => setEditIndex(undefined)}
        pointsReport={(round: Round) => pointsReport(round, editIndex!)}
      />;
      break;
    }
  }

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
          <div className={`grid grid-cols-${teamNames.length} mx-6 mb-2 text-center font-medium text-md text-primary-active`}>
            {teamNames.map(team => (
              <span>{team}</span>
            ))} 
          </div>
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
          ) : (roundEntry)}
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

export default React.memo(Game);