import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Round } from '../../../interfaces';
import { useDispatch, useSelector } from '../../../redux/hooks';
import { enterRound } from '../../../redux/slices/gameSlice';
import RoundEntry2 from './RoundEntry2';
import RoundEntry3 from './RoundEntry3';

const RoundEntry: React.FC = () => {
  const { index } = useParams<{index?: string}>();
  let roundIndex: number | undefined;
  if(index !== undefined) {
    roundIndex = parseInt(index);
    if(isNaN(roundIndex)) roundIndex = undefined;
  }
  const round = useSelector(state => roundIndex !== undefined ? state.game.rounds[roundIndex] : undefined);
  const players = useSelector(state => state.game.players);
  const teams = useSelector(state => state.game.teams);
  const teamOnCall = useSelector(state => state.game.teamOnCall);
  const dispatch = useDispatch();
  const history = useHistory();

  const end = useCallback(() => {
    history.push('/game');
  }, [history]);

  const finish = useCallback((round: Round) => {
    dispatch(enterRound({round}));
    end();
  }, [dispatch, end]);

  if(teams.length === 2) {
    return <RoundEntry2
      team1={teams[0]}
      team2={teams[1]}
      playerCount={players.length}
      teamPoints={round}
      cancel={end}
      pointsReport={finish}
    />;
  } else {
    return <RoundEntry3
      teamOnCall={teamOnCall!}
      team1={teams[0]}
      team2={teams[1]}
      team3={teams[2]}
      teamPoints={round}
      cancel={end}
      pointsReport={finish}
    />;
  }
};

export default RoundEntry;
