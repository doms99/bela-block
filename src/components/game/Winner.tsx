import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import React from 'react';

export interface Props {
  winners: string[],
  newGame: () => void,
  rematch: () => void
}

const Winner: React.FC<Props> = ({ winners, rematch, newGame }) => {
  const message = winners.length === 2 ? 
      `${winners[0]} and ${winners[1]} have won this matsh!` : 
      `${winners[0]} has won this match!`;

  return (
    <Card>
      <CardContent>
        <Typography>{message}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={rematch} variant="contained" color="primary">Rematch</Button>
        <Button onClick={newGame} variant="contained" color="secondary">New game</Button>
      </CardActions>
    </Card>
  );
};

export interface Props {
  winner: string
}

export default Winner;