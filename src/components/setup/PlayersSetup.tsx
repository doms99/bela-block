import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useState } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import { TextField, Typography } from '@material-ui/core';

const PlayersSetup = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(4);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: number | null) => {
    setPlayerCount(newAlignment);
  };

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <ToggleButtonGroup
        size="large"
        value={playerCount}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value={2} aria-label="left aligned">
          <div>
            <PeopleIcon />
            <Typography>2 players</Typography>
          </div>
        </ToggleButton>
        <ToggleButton value={3} aria-label="centered">
          <div>
            <PeopleIcon />
            <Typography>3 players</Typography>
          </div>
        </ToggleButton>
        <ToggleButton value={4} aria-label="right aligned">
          <div>
            <PeopleIcon />
            <Typography>4 players</Typography>
          </div>
        </ToggleButton>
      </ToggleButtonGroup>
      <form style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}} noValidate autoComplete="off">
        {Array.from(Array(playerCount).keys()).map(value => (
          <TextField key={`Player ${value+1}`} id="outlined-basic" label={`Player ${value+1}`} variant="outlined" />
        ))}
      </form>
    </div>
  );
};

export default PlayersSetup;