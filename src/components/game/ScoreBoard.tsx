import { Card, CardContent, Divider, IconButton, Typography } from '@material-ui/core';
import RestoreIcon from '@material-ui/icons/Restore';
import React, { useEffect, useMemo, useState } from 'react';
import { Round } from '../../App';

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
    <Card style={{height: '50vh'}}>
      <CardContent className="vertical max-height">
        <div className={grid}>
          {teams.map((name) => (
            <div key={name}>
              <Typography variant="subtitle1">{name}</Typography>
              <Typography variant="h3">
                {scores[name]}
              </Typography>
              <Typography style={{color: 'gray'}} variant="body2">
                {Math.max(0, scoreTarget - scores[name])}
              </Typography>
            </div>
          ))}
        </div>
        <Divider style={{marginBottom: '0.5em'}}/>
        <div style={{position: 'relative'}} className="width-100 overflow">
        {rounds.slice().reverse().map((round, index) => (
          <div
            style={selectedRound === rounds.length-1-index ?
              {backgroundColor: 'lightgray', borderRadius: '5px'} : 
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
                <Typography variant="subtitle1">
                  {round[team].points}
                </Typography>
                {round[team].declarations !== 0 && (
                  <Typography 
                    color="primary"
                    style={{
                      fontSize: '0.8em',
                      position: 'absolute',
                      transform: Math.floor(round[team].points / 100) > 0 ? 'translateX(120%)' : 'translateX(100%)'
                    }}
                  >
                    +{round[team].declarations}
                  </Typography>
                )}
              </div>
            ))}
            <IconButton
              size="small"
              style={{position: 'absolute', right: 0}}
              onClick={() => setSelectedRound(rounds.length-1-index)}
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreBoard;