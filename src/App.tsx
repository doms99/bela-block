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
import GameWrapper from "./components/game/GameWrapper";
import Dealer from "./components/game/Dealer";
import Slider from "./components/Slider";


function App() {
  const started = useSelector(state => state.game.started);
  const winner = useSelector(state => state.game.winner);
  const teamOnCall = useSelector(state => state.game.teamOnCall);
  const teams = useSelector(state => state.game.teams);

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
          <GameWrapper bottom={<Dealer />} >
            {!!teamOnCall && (
              <div className="absolute top-0 w-full px-6 ">
                <Slider divisions={3} value={teams.indexOf(teamOnCall!)+1}>
                  <div className={`rounded-b-full w-8 h-4 m-auto bg-white`} />
                </Slider>
              </div>
            )}
            <Route exact path="/game">
              {winner && <Winner />}
              <Game />
            </Route>
            <Route path="/game/round/:index?">
              <RoundEntry />
            </Route>
          </GameWrapper>
          <Redirect from="/*" to="/setup" />
        </Switch>
      </BrowserRouter>
  );
}

export default App;