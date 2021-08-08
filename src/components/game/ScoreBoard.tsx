import { Card, CardContent, Divider, Typography } from '@material-ui/core';
import React from 'react';

export const sumOfPoints = (points: number[], declarations: number[]) => {
  return points.reduce((acc, curr) => acc + curr, 0) + declarations.reduce((acc, curr) => acc + curr, 0);
}

export interface Props {
  rounds: Record<string, {points: number, declarations: number}>[],
  teams: string[],
  setEditIndex: (index: number) => void
}

const ScoreBoard: React.FC<Props> = ({ teams, rounds, setEditIndex }) => {

  return (
    <Card style={{height: '50vh'}}>
      <CardContent className="vertical max-height">
        <div className="horizontal">
          {teams.map((name) => (
            <div key={name}>
              <Typography variant="subtitle1">{name}</Typography>
              <Typography variant="h3">
                {sumOfPoints(rounds.map(r => r[name].points),rounds.map(r => r[name].declarations))}
              </Typography>
            </div>
          ))}
        </div>
        <Divider style={{marginBottom: '0.5em'}}/>
        <div className="horizontal width-100 overflow">
        {teams.map((name) => (
            <div className="width-100" key={name}>
              {rounds.slice().reverse().map(round => round[name]).map(({ points, declarations }, index) => (
                <div style={{display: 'flex', justifyContent: 'center'}} className="width-100" key={`${index}`}>
                  <Typography 
                    variant="subtitle1"
                    onClick={() => setEditIndex(rounds.length-1-index)}
                  >
                    {points}
                  </Typography>
                  {declarations !== 0 && (
                    <Typography 
                      color="primary"
                      style={{
                        fontSize: '0.8em',
                        position: 'absolute',
                        transform: Math.floor(points / 100) > 0 ? 'translateX(120%)' : 'translateX(100%)'
                      }}
                    >
                      +{declarations}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreBoard;