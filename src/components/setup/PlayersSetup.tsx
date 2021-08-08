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
  const [scoreTarget, setScoreTarget] = useState<number>(1001);
  const history = useHistory();
  const { startGame } = useContext(GlobalState);

  const handlePlayerCount = (event: React.MouseEvent<HTMLElement>, newPlayerCount: number | null) => {
    if(!newPlayerCount) return;

    setPlayerCount(newPlayerCount);
  };

  const handleScoreTarget = (event: React.MouseEvent<HTMLElement>, scoreTarget: number | null) => {
    if(!scoreTarget) return;

    setScoreTarget(scoreTarget);
  };

  const nameReport = (names: string[]) => {
    startGame(names, scoreTarget);
    history.push('/game');
  }

  return (
    <Container style={verticalFlex}>
      <ToggleButtonGroup
        size="large"
        value={playerCount}
        exclusive
        onChange={handlePlayerCount}
        aria-label="player count"
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
      <Divider style={{width: '100%', margin: '0.5em 0'}} />
      <ToggleButtonGroup
        size="large"
        value={scoreTarget}
        exclusive
        onChange={handleScoreTarget}
        aria-label="score target"
      >
        <ToggleButton value={501} aria-label="right aligned">
          501
        </ToggleButton>
        <ToggleButton value={701} aria-label="right aligned">
          701
        </ToggleButton>
        <ToggleButton value={1001} aria-label="right aligned">
          1001
        </ToggleButton>
      </ToggleButtonGroup>
      <Divider style={{width: '100%', margin: '0.5em 0'}} />
      <SittingOrder playerCount={playerCount} nameReport={nameReport} />
    </Container>
  );
};

export default PlayersSetup;