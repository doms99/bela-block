import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import React from 'react';

export interface Props {
  winner: string,
  newGame: () => void,
  rematch: () => void
}

const Winner: React.FC<Props> = ({ winner, rematch, newGame }) => {
  return (
    <div className="before">
      <Card className="absolute-card">
        <CardContent>
          <Typography><b>{winner}</b> won this match</Typography>
        </CardContent>
        <CardActions style={{justifyContent: 'space-around'}}>
          <Button onClick={rematch} variant="contained" color="primary">Rematch</Button>
          <Button onClick={newGame} variant="contained" color="secondary">New game</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Winner;