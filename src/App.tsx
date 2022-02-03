import Game from "./components/game/controllers/Game";
import PlayersSetup from "./components/setup/PlayersSetup";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useSelector } from "./redux/hooks";


function App() {
  const started = useSelector(state => state.game.started);

  return (
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/setup" />
          {!started ? (
            <Redirect exact from="/game" to="/setup" />
          ) : (
            <Redirect exact from="/setup" to="/game" />
          )}
          <Route path="/setup">
            <PlayersSetup />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Redirect from="/*" to="/setup" />
        </Switch>
      </BrowserRouter>
  );
}

export default App;