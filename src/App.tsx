import Game from "./components/game/controllers/Game";
import PlayersSetup from "./components/setup/PlayersSetup";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useSelector } from "./redux/hooks";
import { RoundEntry } from "./components/game/controllers/RoundEntry";


function App() {
  const started = useSelector(state => state.game.started);

  return (
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/setup" />
          {!started && (
            <>
              <Redirect from="/game/round" to="/setup" />
              <Redirect exact from="/game" to="/setup" />
            </>
          )}
          <Route path="/setup">
            <PlayersSetup />
          </Route>
          <Route exact path="/game">
            <Game />
          </Route>
          <Route path="/game/round(/:index">
            <RoundEntry />
          </Route>
          <Redirect from="/*" to="/setup" />
        </Switch>
      </BrowserRouter>
  );
}

export default App;