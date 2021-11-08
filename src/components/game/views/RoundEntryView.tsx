import { Round } from "../../../interfaces";
import { Input, SelectedInput, Sugestion } from "../../../interfaces";
import BackspaceIcon from "../../icons/BackspaceIcon";
import CancelIcon from "../../icons/CancelIcon";
import ConfirmIcon from "../../icons/ConfirmIcon";
import EnteredPoints from "./EnteredPoints";

export interface Props {
  teams: string[],
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

const RoundEntry: React.FC<Props> = ({ teams, sugestions, round, selected, setSelected, error, cancel, numberClick, backspace, clear, canSaveRound, saveRound }) => {

  return (
    <div className="green-backdrop">
      <section className={`grid grid-cols-${teams.length} mx-6`}>
        {teams.map((team, index) => (
          <EnteredPoints
            sugestion={sugestions[team]}
            points={round[team].points}
            declarations={round[team].declarations}
            selected={selected.team === team ? selected.input : undefined}
            setSelected={(input: Input) => setSelected(team, input)}
          />
        ))}
      </section>
      <div className="h-8 w-full text-center">
          { error && <span className="text-lg font-bold">{error}</span> }
      </div>
      <section className="h-50vh content-box mx-6">
        <div className="grid grid-cols-3 text-3xl h-full" >
          {Array.from(Array(9).keys()).map(num => (
            <button 
              className="no-bg-green"
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
        <div className="ml-20 w-24 h-24">
          <button
            className="outlined-bnt text-error hover:text-error-active"
            onClick={cancel}
          >
            <CancelIcon className="w-2/4 m-auto" />
          </button>
        </div>
        <div className="mr-20 w-24 h-24">
          <button
            className="outlined-bnt text-primary hover:text-primary-active"
            disabled={!canSaveRound}
            onClick={saveRound}
          >
            <ConfirmIcon className="w-4/6 m-auto"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundEntry;