import React, { memo } from 'react';
import { useSelector } from "../../redux/hooks";
import ScoreBoard from "./ScoreBoard";

const Game: React.FC = () => {
  const teams = useSelector(state => state.game.teams);
  const teamOnCall = useSelector(state => state.game.teamOnCall);
  const winner = useSelector(state => state.game.winner);

  return (
    <GameView
      teams={teams}
      winner={winner}
      teamOnCall={teamOnCall}
    />
  );
};

export default Game;

export type ViewProps = {
  teams: string[],
  teamOnCall?: string,
  winner?: string
}

export const GameView: React.FC<ViewProps> = memo(({ teams, winner, teamOnCall }) => {
  return (
    <main className="h-full text-right text-white overflow-x-hidden">
      <div className="h-full flex flex-col">
        <div className={`grid grid-cols-${teams.length} mx-6 mb-2 text-center font-medium text-md text-primary-active`}>
          {teams.map(team => (
            <span key={team}>{team}</span>
          ))}
        </div>
        <ScoreBoard />
      </div>
    </main>
  )
});