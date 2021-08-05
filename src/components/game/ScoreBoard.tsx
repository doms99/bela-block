import { Card, CardContent, Divider, Typography } from '@material-ui/core';
import React from 'react';

export const sumOfPoints = (points: number[], declarations: number[]) => {
  return points.reduce((acc, curr) => acc + curr, 0) + declarations.reduce((acc, curr) => acc + curr, 0);
}

export interface Props {
  playerScores: Record<string, {points: number[], declarations: number[]}>,
  setEditIndex: (index: number) => void
}

const ScoreBoard: React.FC<Props> = ({ playerScores, setEditIndex }) => {

  return (
    <Card style={{height: '50%'}}>
      <CardContent className="vertical max-height">
        <div className="horizontal">
          {Object.entries(playerScores).map(([player, round]) => (
            <div key={player}>
              <Typography variant="subtitle1">{player}</Typography>
              <Typography variant="h3">{sumOfPoints(round.points, round.declarations)}</Typography>
            </div>
          ))}
        </div>
        <Divider style={{marginBottom: '0.5em'}}/>
        <div className="horizontal width-100 overflow">
          {Object.entries(playerScores).map(([player, round]) => (
            <div className="width-100" key={player}>
              {round.points.slice().reverse().map((point, index) => (
                <div style={{display: 'flex', justifyContent: 'center'}} className="width-100" key={point * (index + 1)}>
                  <Typography 
                    variant="subtitle1"
                    onClick={() => setEditIndex(round.points.length-1-index)}
                  >
                    {point}
                  </Typography>
                  {round.declarations[round.points.length-1-index] !== 0 && (
                    <Typography 
                      color="primary"
                      style={{
                        fontSize: '0.8em',
                        position: 'absolute',
                        transform: Math.floor(round.points[round.points.length-1-index] / 100) > 0 ? 'translateX(120%)' : 'translateX(100%)'
                      }}
                    >
                      +{round.declarations[round.points.length-1-index]}
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