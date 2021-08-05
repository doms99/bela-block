import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';

export interface Props {
  winners: string[]
}

const Winner: React.FC<Props> = ({ winners }) => {
  const message = winners.length === 2 ? 
      `${winners[0]} and ${winners[1]} have won this matsh!` : 
      `${winners[0]} has won this match!`;

  return (
    <Card>
      <CardContent>
        <Typography>{message}</Typography>
      </CardContent>
    </Card>
  );
};

export interface Props {
  winner: string
}

export default Winner;