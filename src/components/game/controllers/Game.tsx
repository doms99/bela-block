import RoundEntry from "./RoundEntry";
import RoundEntry from "./RoundEntry";
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import ScoreBoardView from '../views/ScoreBoardView';
import { Round } from "../../../interfaces";
import Winner from '../views/Winner';
import { useHistory } from 'react-router';
import Dealer from '../views/Dealer';
import { useDispatch, useSelector } from "../../../redux/hooks";
import { enterRound, setDealer as dealerAction } from "../../../redux/slices/gameSlice";

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const { dealer, players, rounds, scoreTarget } = useSelector(state => state.game);

  const [editIndex, setEditIndex] = useState<number>();
  const history = useHistory();


  const teamOnCall = players.length !== 3 ?
    undefined :
    players[(players.indexOf(dealer!) + 1) % players.length];

  return (
    <>
      {/* {started && (
        <button
          onClick={() => {history.push('/setup')}}
          className="absolute top-0 left-0 mt-5 ml-6 z-50"
        >
          <Arrow className="h-7 stroke-primary-active"/>
        </button>
      )} */}
      <main className="relative h-full text-right text-white overflow-x-hidden">
        {teams.length === 3 && !!teamOnCall ? (
          <div className="absolute top-0 w-full px-6 grid grid-cols-3 ">
            <div className={`rounded-b-full w-8 h-4 m-auto bg-white col-start-${teams.indexOf(teamOnCall)+1}`} />
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
          <div className={`grid grid-cols-${teams.length} mx-6 mb-2 text-center font-medium text-md text-primary-active`}>
            {teams.map(team => (
              <span>{team}</span>
            ))}
          </div>
          {editIndex === undefined ? (
            <ScoreBoardView
              lastSumIndex={selectedRound}
              roundActions={[
                  {name: 'Edit', action: (index: number) => setEditIndex(index)},
                  {name: 'Rewind', action: (index: number) => setSelectedRound(index)},
                  {name: 'Delete', action: (index: number) => deleteRound(index)}
                ]}
              rounds={rounds}
              scoreTarget={scoreTarget}
              setEditIndex={setEditIndex}
              teams={teams}
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