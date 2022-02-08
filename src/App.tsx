import Game from "./components/game/Game";
import PlayersSetup from "./components/setup/PlayersSetup";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useSelector } from "./redux/hooks";
import RoundEntry from "./components/game/RoundEntry";
import Winner from "./components/game/Winner";


function App() {
  const started = useSelector(state => state.game.started);
  const winner = useSelector(state => state.game.winner);

  return (
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/setup" />
          {!started && (
            <Redirect from="/game" to="/setup" />
          )}
          <Route path="/setup">
            <PlayersSetup />
          </Route>
          <Route exact path="/game">
            {winner ? <Winner /> : <Game />}
          </Route>
          <Route path="/game/round/:index?">
            <RoundEntry />
          </Route>
          <Redirect from="/*" to="/setup" />
        </Switch>
      </BrowserRouter>
  );
}

export default App;