import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useContext, useState } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import { Container, Divider, Typography } from '@material-ui/core';
import "../../styles/Setup.css";
import { CSSProperties } from '@material-ui/styles';
import SittingOrder from './SittingOrder';
import { GlobalState } from '../../App';
import { useHistory } from 'react-router';

const verticalFlex: CSSProperties= {
  display:' flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const PlayersSetup = () => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const history = useHistory();
  const { startGame } = useContext(GlobalState);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newPlayerCount: number | null) => {
    if(!newPlayerCount) return;

    setPlayerCount(newPlayerCount);
  };

  const nameReport = (names: string[]) => {
    startGame(names);
    history.push('/game');
  }

  return (
    <Container style={verticalFlex}>
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
      <Divider style={{width: '100%', marginTop: '0.5em'}} />
      <SittingOrder playerCount={playerCount} nameReport={nameReport} />
    </Container>
  );
};

export default PlayersSetup;