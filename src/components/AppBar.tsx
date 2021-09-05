import { Button, Toolbar, Typography, AppBar as AppBarOrig } from '@material-ui/core';
import React from 'react';
import { useHistory, useLocation } from 'react-router';

const AppBar = () => {
  const location = useLocation();
  const history = useHistory();

  return (
    <AppBarOrig position="static" style={{marginBottom: '1em'}}>
      <Toolbar>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Bela Block
        </Typography>
        {location.pathname !== '/setup' && <Button color="inherit" onClick={() => history.push('/setup')}>New game</Button>}
      </Toolbar>
    </AppBarOrig>
  );
};

export default AppBar;