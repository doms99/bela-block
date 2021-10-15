import { useCallback, useEffect, useState } from "react";
import { Round } from "../../App";
import BackspaceIcon from "../icons/BackspaceIcon";
import CancelIcon from "../icons/CancelIcon";
import ConfirmIcon from "../icons/ConfirmIcon";
import EnteredPoints from "./EnteredPoints";

interface Bonus {
  [key: string]: {
    value: number,
    confirmed: boolean
  }
}

export interface Props {
  teams: string[],
  playerPoints?: Round,
  pointsReport: (round: Round) => void,
  playerCount: number,
  cancel: () => void,
  teamOnCall?: string
}

const zeroValues = (players: string[]) => {
  return players.reduce((obj, player) => ({...obj, [player]: { points: 0, declarations: 0 }}), {});
}

const zeroBonuses = (teams: string[]) => {
  const result: Bonus = {};

  teams.forEach(team => result[team] = {value: 0, confirmed: false});

  return result;
}

const adjustPlayerPoints = (playerPoints: Round): [Round, Bonus] => {
  const bonuses = zeroBonuses(Object.keys(playerPoints));
  const newPlayerPoints: Round = {};

  for(const [team, round] of Object.entries(playerPoints)) {
    newPlayerPoints[team] = {...round};
    if(round.bonus) {
      newPlayerPoints[team].declarations -= bonusPoints;
      bonuses[team] = {value: bonusPoints, confirmed: true};
    }
  }

  return [newPlayerPoints, bonuses];
} 

const bonusPoints = 90;

const RoundEntry: React.FC<Props> = ({ teams, teamOnCall, playerPoints, playerCount, pointsReport, cancel }) => {
  const [playerPointsAdjusted, bonusesCalculated] = playerPoints ? adjustPlayerPoints(playerPoints) : [zeroValues(teams), zeroBonuses(teams)];
  
  const [values, setValues] = useState<Round>(playerPointsAdjusted);
  const [selected, setSelected] = useState<{team: string, input: 'points' | 'declarations'}>({team: teams[0], input: 'points'});
  const [error, setError] = useState<string | undefined>();
  const [pass, setPass] = useState<boolean | undefined>(undefined);
  const [edited, setEdited] = useState<boolean[]>(teams.map(team => !playerPoints || team === teamOnCall ? false : true));
  const [bonuses, setBonuses] = useState<Bonus>(bonusesCalculated);
  const [fallSuggestion, setFallSuggestion] = useState<boolean[]>(teams.map(_ => false));
  const [fallen, setFallen] = useState<string | undefined>();

  const calcPoints = useCallback(() => {
    return Object.values(values).map(value => value.points).reduce((sum, points) => sum + points, 0);
  }, [values]);

  useEffect(() => {
    if(calcPoints() <= 162) {
      setError(undefined);

      return;
    }

    setError("More then 162 points entered");
  }, [values, calcPoints]);

  useEffect(() => {
    if(Object.values(values).map((round) => round.points).reduce((sum, val) => sum += val, 0) === 0) {
      setEdited(teams.map(_ => false));
    }
  }, [values, teams]);

  useEffect(() => {
    if(!!fallen) return;

    for(const team of teams) {
      if(values[team].points === 162) {
        setBonuses(curr => ({...curr, [team]: {value: bonusPoints, confirmed: values[team].bonus ? true : playerCount === 3 ? true : false}}));
        continue;
      }

      setBonuses(curr => ({...curr, [team]: {value: 0, confirmed: false}}))
    }
  }, [values, teams, fallen, playerCount]);

  useEffect(() => {
    if(playerCount !== 3) return;

    const otherTeamsPoints = Object.entries(values)
      .filter(([team]) => team !== teamOnCall)
      .map(([team, round]) => round.points + round.declarations + (bonuses[team].confirmed ? bonuses[team].value : 0))
      .reduce((sum, points) => sum += points, 0);

    if(otherTeamsPoints === 0 && values[teamOnCall!].points !== 162) {
      setPass(undefined);
      return;
    }

    if(otherTeamsPoints === 162) {
      setPass(false);
      return;
    }

    if(values[teamOnCall!].points === 162) {
      setPass(true);
      return;
    }

    if(edited.reduce((val, status) => status ? val : val+1, 0) > 1) return;

    if(values[teamOnCall!].points + values[teamOnCall!].declarations + (bonuses[teamOnCall!].confirmed ? bonuses[teamOnCall!].value : 0) <= otherTeamsPoints) {
      setPass(false);
      return;
    }

    setPass(true);
  }, [teams, values, teamOnCall, bonuses, edited, playerCount]);

  useEffect(() => {
    if(playerCount === 3) return;
    if(playerCount === 4 && (!edited[0] && !edited[1])) return;
    if(playerCount === 2 && (!edited[0] || !edited[1])) return;
    if(values[teams[0]].points === 162 || values[teams[1]].points === 162 ||
       values[teams[0]].points === 0 || values[teams[1]].points === 0) {
      setFallSuggestion([false, false]);
      return;
    }

    const teamOnePoints = values[teams[0]].points + values[teams[0]].declarations + (bonuses[teams[0]].confirmed ? bonuses[teams[0]].value : 0);
    const teamTwoPoints = values[teams[1]].points + values[teams[1]].declarations + (bonuses[teams[1]].confirmed ? bonuses[teams[1]].value : 0);

    switch(Math.min(1, Math.max(teamOnePoints - teamTwoPoints, -1))) {
      case 1:
        setFallSuggestion([false, true]);
        break;
      case -1:
        setFallSuggestion([true, false]);
        break;
      default:
        setFallSuggestion([true, true]);
    }
  }, [bonuses, playerCount, values, teams, edited]);

  const updateState_2 = (state: Round) => state;

  const updateState_3 = (state: Round, edited: boolean[]) => {
    if(edited.reduce((val, status) => status ? val : val+1, 0) !== 1) return state;

    const uneditedPlayer = teams[edited.indexOf(false)];

    let uneditedPlayerPoints = 162 - teams.filter(name => name !== uneditedPlayer).reduce((val, name) => val += state[name].points, 0);
    let newState = {
      ...state,
      [uneditedPlayer]: {
        ...state[uneditedPlayer],
        points: Math.max(0, uneditedPlayerPoints)
      }
    };

    const teamOnCallPoints = newState[teamOnCall!].points + newState[teamOnCall!].declarations + bonuses[teamOnCall!].value;
    const sumOfRest = Object.entries(newState)
                        .filter(([team]) => team !== teamOnCall)
                        .map(([team, round]) => round.points + round.declarations + bonuses[team].value)
                        .reduce((sum, val) => sum + val, 0);
    
    if(sumOfRest >= teamOnCallPoints) {
      return {
        ...newState,
        [teamOnCall!]: {
          ...state[teamOnCall!],
          points: 0
        }
      }
    }
    
    return newState;
  }

  const updateState_4 = (state: Round) => {
    if(playerCount === 2) return state;
    if(selected.input === 'declarations') return state;

    const otherPlayers = teams.filter(name => name !== selected.team);

    return {
      ...state,
      [otherPlayers[0]]: {
        ...state[otherPlayers[0]],
        points: Math.max(162 - state[selected.team].points, 0)
      }
    };
  }

  let updateState: (state: Round, edited: boolean[]) => Round;
  switch(playerCount) {
    case 3:
      updateState = updateState_3;
      break;
    case 4:
      updateState = updateState_4;
      break;
    default:
      updateState = updateState_2;
  }

  const updateEdited = () => {
    let passedEdited: boolean[] = edited;
    if(selected.input === 'points') {
      setEdited(curr => {
        const newEdited = [...curr];
        newEdited[teams.indexOf(selected.team)] = true;
  
        passedEdited = newEdited;
        return newEdited;
      })
    }

    return passedEdited;
  }

  const setValue = (digit: number) => {
    if(Math.floor(values[selected.team][selected.input]/100) !== 0) return;
    
    const passedEdited = updateEdited();

    setFallen(undefined);

    setValues(curr => {
      const newState = {
        ...curr,
        [selected.team]: {
          ...curr[selected.team],
          [selected.input]: curr[selected.team][selected.input]*10 + digit
        }
      }

      return updateState(newState, passedEdited);
    });
  }

  const clear = () => {
    if(values[selected.team][selected.input] !== 0) setFallen(undefined);

    const passedEdited = updateEdited();
    
    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: 0
      }
    }, passedEdited));
  }

  const backspace = () => {
    if(values[selected.team][selected.input] !== 0) setFallen(undefined);

    const passedEdited = updateEdited();

    setValues(curr => updateState({
      ...curr,
      [selected.team]: {
        ...curr[selected.team],
        [selected.input]: Math.floor(curr[selected.team][selected.input] / 10)
      }
    }, passedEdited));
  }

  const end = () => {
    if(calcPoints() > 162) {
      setError("Can't enter more then 162 points");

      return;
    }

    const reportState = {...values};
    for(const team of teams) {
      if(reportState[team].points === 0) {
        reportState[team].declarations = 0;
        continue;
      }

      if(bonuses[team].confirmed) {
        reportState[team].declarations += bonuses[team].value;
        reportState[team].bonus = true;
      } else {
        reportState[team].bonus = false;
      }
    }

    pointsReport(reportState);
  }

  const fall = (team: string) => {
    setFallen(team);
    setFallSuggestion([false, false]);
    setValues(curr => {
      const newValues = {...curr};
      const otherTeam = teams.filter(name => name !== team)[0];

      newValues[otherTeam].points += newValues[team].points;
      newValues[otherTeam].declarations += newValues[team].declarations;
      newValues[team].points = 0;
      newValues[team].declarations = 0;

      return newValues;
    })
  }

  return (
    <div className="green-backdrop">
      <section className={`grid grid-cols-${teams.length} ml-10 mr-10`}>
        {teams.map((team, index) => (
          <EnteredPoints
            sugestion={
              fallSuggestion[index] ? {text: "fall?", callback: () => fall(team)} : 
              !!bonuses[team].value ? {text: `+${bonusPoints} points`, callback: () => setBonuses(curr => ({...curr, [team]: {...curr[team], confirmed: !curr[team].confirmed}}))} :
              undefined
            }
            points={values[team].points}
            declarations={values[team].declarations}
            selected={selected.team === team ? selected.input : undefined}
            setSelected={(input: 'points' | 'declarations') => setSelected({team, input})}
          />
        ))}
      </section>
      <div className="h-8 w-full text-center">
          { error && <span className="text-lg font-bold">{error}</span> }
      </div>
      <section className="text-center bg-white text-black pt-4 ml-16 pb-10 h-50vh rounded-b-ellipse rounded-t-5xl mr-16">
        <div className="grid grid-cols-3 text-3xl h-full" >
          {Array.from(Array(9).keys()).map(num => (
            <button 
              className="no-bg-btn"
              onClick={() => setValue(num+1)}
            >
              {num+1}
            </button>
          ))}
          
          <button 
            className="no-bg-btn text-black hover:text-gray-500"
            onClick={backspace}
          >
            <BackspaceIcon className="w-6 m-auto" />
          </button>
          <button 
            className="no-bg-btn"
            onClick={() => setValue(0)}
          >
            {0}
          </button>
          <button 
            className="no-bg-btn text-black hover:text-gray-500"
            onClick={clear}
          >
            <CancelIcon className="w-6 m-auto" />
          </button>

        </div>
      </section>
      <div className="w-full -mt-10 h-24 flex justify-between">
        <div className="ml-28 w-24 h-24">
          <button
            className="outlined-bnt text-error hover:text-error-active"
            onClick={cancel}
          >
            <CancelIcon className="w-2/4 m-auto" />
          </button>
        </div>
        <div className="mr-28 w-24 h-24">
          <button 
            className="outlined-bnt text-primary hover:text-primary-active"
            disabled={!!error || !edited.some(v => v)}
            onClick={end}
          >
            <ConfirmIcon className="w-4/6 m-auto"/>
          </button>
        </div>
      </div>
    </div>
    // <div className="before">
    //   <section className="absolute-card">
    //     <div>
    //       <div className={grid}>
    //         {teams.map(name => <span key={name}>{name}</span>)}
    //       </div>
    //       <div className="horizontal" style={{marginBottom: '0.5em'}}>
    //         {teams.map((team, index) => 
    //           <div
    //             className="points-enter"
    //             key={team}
    //             // elevation={team === selected.player ? 4 : 1}
    //             style={team === teamOnCall ? 
    //               {...pointOnCallStyle,
    //                 position: 'relative',
    //                 borderColor
    //               } : fallen === team ? 
    //                 {position: 'relative', ...pointOnCallStyle, borderColor: 'red'} : 
    //                 {position: 'relative'}
    //             }
    //           >
    //             {(teamOnCall === team || fallen === team) && (
    //               <div style={{borderRadius: '0 5px', position: 'absolute', right: -1, top: -1, padding: '4px 8px', color: 'white', backgroundColor: playerCount === 3 ? borderColor : 'red'}}>
    //                 <span style={{fontSize: '0.8em'}}>{playerCount ===3 ? status : 'fail'}</span>
    //               </div>
    //             )}
    //             {!!bonuses[team].value && (
    //               <div
    //                 // elevation={2}
    //                 style={{cursor: 'pointer',color: bonuses[team].confirmed ? 'inherit' : 'lightgray', position: 'absolute', right: '-0.5em', top: '50%', transform: 'translateY(-50%)', padding: '4px 6px'}}
    //                 onClick={() => setBonuses(curr => ({...curr, [team]: {...curr[team], confirmed: !curr[team].confirmed}}))}
    //               >
    //                 <span>+{bonuses[team].value}</span>
    //                 <span style={{fontSize: '0.6em', marginTop: '-0.8em'}}>bonus</span>
    //               </div>
    //             )}
    //             {fallSuggestion[index] && (
    //               <div
    //                 // elevation={2}
    //                 style={{cursor: 'pointer', position: 'absolute', right: '-0.5em', top: '50%', transform: 'translateY(-50%)', padding: '4px 6px'}}
    //                 onClick={() => fall(team)}
    //               >
    //                 <span>fall?</span>
    //               </div>
    //             )}
    //             <div style={{
    //               color: selected.player === team && selected.input === 'points' ? 'black' : 'inherit'}}
    //               onClick={() => setSelected({player: team,  input: 'points'})}
    //             >
    //               <span
    //                 style={{
    //                   textAlign: 'left',
    //                   color: selected.player === team && selected.input === 'points' ? 'black' : 'gray',
    //                   fontSize: '0.8em'
    //                 }}
    //               >
    //                 Points
    //               </span>
    //               <span
    //                 style={{
    //                   fontSize: '1.2em',
    //                   color: selected.player === team && selected.input === 'points' ? 'black' : 'gray',
    //                   marginBottom: '4px'
    //                 }}
    //               >
    //                 {values[team].points}
    //               </span>
    //             </div>
    //             <div className="horizontal">
    //               <hr style={{flexGrow: 1, marginRight: '0.4em'}} />
    //               <span style={{fontSize: '0.8em'}}>
    //                 {team === teamOnCall && pass === false ? 0 :
    //                   values[team].points+values[team].declarations+(bonuses[team].confirmed ? bonuses[team].value : 0)}
    //               </span>
    //               <hr style={{flexGrow: 1, marginLeft: '0.4em'}}/>
    //             </div>
    //             <div
    //               onClick={() => setSelected({player: team,  input: 'declarations'})}
    //             >
    //               <span
    //                 style={{
    //                   fontSize: '1.2em',
    //                   color: selected.player === team && selected.input === 'declarations' ? 'black' : 'gray',
    //                   marginTop: '4px'
    //                 }}
    //               >
    //                 {values[team].declarations}
    //               </span>
    //               <span
    //                 style={{
    //                   textAlign: 'left',
    //                   color: selected.player === team && selected.input === 'declarations' ? 'black' : 'gray',
    //                   fontSize: '0.8em'
    //                 }}
    //               >
    //                 Declarations
    //               </span>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //       <span style={{color: error ? 'red' : 'white'}}>{error ? error : 'i'}</span>
    //       <div className="grid num-pad">
    //         <button onClick={() => setValue(1)}>1</button>
    //         <button onClick={() => setValue(2)}>2</button>
    //         <button onClick={() => setValue(3)}>3</button>
    //         <button onClick={() => setValue(4)}>4</button>
    //         <button onClick={() => setValue(5)}>5</button>
    //         <button onClick={() => setValue(6)}>6</button>
    //         <button onClick={() => setValue(7)}>7</button>
    //         <button onClick={() => setValue(8)}>8</button>
    //         <button onClick={() => setValue(9)}>9</button>
    //         <button onClick={backspace}>b</button>
    //         <button onClick={() => setValue(0)}>0</button>
    //         <button onClick={clear}>clear</button>
    //       </div>
    //     </div>
    //     <div className="horizontal">
    //       <button onClick={cancel} color="secondary">Cancel</button>
    //       <button disabled={!!error || Object.values(values).reduce((acc, value) => acc+value.points, 0) === 0} onClick={end} >Save</button>
    //     </div>
    //   </section>
    // </div>
  );
};

export default RoundEntry;