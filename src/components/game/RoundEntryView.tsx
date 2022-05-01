import { memo } from "react";
import { Round } from "../../interfaces";
import { Input, SelectedInput, Sugestion } from "../../interfaces";
import BackspaceIcon from "../icons/BackspaceIcon";
import CancelIcon from "../icons/CancelIcon";
import ConfirmIcon from "../icons/ConfirmIcon";
import EnteredPoints from "./EnteredPoints";

export interface Props {
  teams: string[],
  teamOnCall?: string,
  round: Round,
  error?: string,
  sugestions: {[key: string]: Sugestion},
  canSaveRound: boolean,
  selected: SelectedInput,

  setSelected: (team: string, input: Input) => void
  cancel: () => void,
  numberClick: (value: number) => void,
  backspace: () => void,
  clear: () => void,
  saveRound: () => void,
}

const RoundEntryView: React.FC<Props> = ({ teams, teamOnCall, sugestions, round, selected, setSelected, error, cancel, numberClick, backspace, clear, canSaveRound, saveRound }) => {
  return (
    <>
      <div className="h-full flex flex-col">
        <div className={`grid grid-cols-${teams.length} mx-6 mb-2 text-center font-medium text-md text-primary-active`}>
          {teams.map(team => (
            <span key={team}>{team}</span>
          ))}
        </div>
        <section className={`grid grid-cols-${teams.length} mx-6`}>
          {teams.map((team) => (
            <EnteredPoints
              key={team}
              team={team}
              sugestion={sugestions[team]}
              points={round[team].points}
              declarations={round[team].declarations}
              bonus={round[team].bonus}
              selected={selected.team === team ? selected.input : undefined}
              setSelected={setSelected}
            />
          ))}
        </section>
        <div className="h-8 w-full flex-none text-center">
            { error && <span className="text-lg text-white font-bold">{error}</span> }
        </div>
        <section className="h-full content-box bg-white mx-6">
          <div className="grid grid-cols-3 text-3xl h-full" >
            {Array.from(Array(9).keys()).map(num => (
              <button
                className="no-bg-green"
                key={num}
                onClick={() => numberClick(num+1)}
              >
                {num+1}
              </button>
            ))}
            <button
              className="no-bg-black"
              onClick={backspace}
            >
              <BackspaceIcon className="w-6 m-auto" />
            </button>
            <button
              className="no-bg-green"
              onClick={() => numberClick(0)}
            >
              {0}
            </button>
            <button
              className="no-bg-black"
              onClick={clear}
            >
              <CancelIcon className="w-6 m-auto" />
            </button>
          </div>
        </section>
        <div className="w-full -mt-12 h-24 flex justify-between">
            <button
              className="outlined-bnt ml-16 sm:ml-28 w-24 h-24 text-error hover:text-error-active"
              onClick={cancel}
            >
              <CancelIcon className="w-2/4 m-auto" />
            </button>
            <button
              className="outlined-bnt mr-16 sm:mr-28 w-24 h-24 text-primary hover:text-primary-active"
              disabled={!canSaveRound}
              onClick={saveRound}
            >
              <ConfirmIcon className="w-4/6 m-auto"/>
            </button>
        </div>
      </div>
    </>
  );
};

export default memo(RoundEntryView);