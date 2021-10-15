import React, { useEffect, useMemo, useState } from 'react';
import { Round } from '../../App';
import '../../styles/Game.css';
import TotalPoints from './TotalPoints';

export const sumOfPoints = (points: number[], declarations: number[]) => {
  return points.reduce((acc, curr) => acc + curr, 0) + declarations.reduce((acc, curr) => acc + curr, 0);
}

export interface Props {
  rounds: Round[],
  teams: string[],
  setEditIndex: (index: number) => void,
  scoreTarget: number
}

const ScoreBoard: React.FC<Props> = ({ teams, scoreTarget, rounds, setEditIndex }) => {
  const [selectedRound, setSelectedRound] = useState<number>(rounds.length - 1);

  useEffect(() => {
    setSelectedRound(rounds.length-1)
  }, [rounds]);

  const scores: Record<string, number> = useMemo(() => teams.reduce((obj, name) => ({
      ...obj, 
      [name]: sumOfPoints(rounds.slice(0, selectedRound+1).map(r => r[name].points),rounds.slice(0, selectedRound+1).map(r => r[name].declarations))
  }), {}), [rounds, selectedRound, teams]);

  const grid = teams.length === 3 ? "points-grid-3" : "points-grid-2";

  return (
    <section className="h-50vh overflow-x-hidden">
      <div>
        <div className={grid}>
          {teams.map((name) => (
            <TotalPoints key={name} points={scores[name]} scoreTarget={scoreTarget} />
          ))}
        </div>
        <hr style={{marginBottom: '0.5em'}}/>
        <div style={{position: 'relative'}} className="width-100 overflow">
        {rounds.slice().reverse().map((round, index) => (
          <div
            style={selectedRound === rounds.length-1-index ?
              {backgroundColor: 'rgba(0, 0, 0, .1)', borderRadius: '5px'} : 
              rounds.length-1-index > selectedRound ? {color: 'lightgray'} : {}}
            key={index}
            className={grid}
          >
            {teams.map(team => (
              <div 
                style={{display: 'flex', justifyContent: 'center', cursor: 'pointer'}} 
                className="width-100"
                key={team}
                onClick={() => setEditIndex(rounds.length-1-index)}
              >
                <span>
                  {round[team].points}
                </span>
                {round[team].declarations !== 0 && (
                  <span 
                    style={{
                      fontSize: '0.8em',
                      position: 'absolute',
                      transform: Math.floor(round[team].points / 100) > 0 ? 'translateX(120%)' : 'translateX(100%)'
                    }}
                  >
                    +{round[team].declarations}
                  </span>
                )}
              </div>
            ))}
            <button
              style={{position: 'absolute', right: 0}}
              onClick={() => setSelectedRound(rounds.length-1-index)}
            >
              b
            </button>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default ScoreBoard;