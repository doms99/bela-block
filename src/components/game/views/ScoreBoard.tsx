import { Round, RoundActions } from '../../../interfaces';
import AddIcon from '../../icons/AddIcon';
import RoundPoints from '../controllers/RoundPoints';
import TotalPoints from './TotalPoints';

export const sumOfPoints = (points: number[], declarations: number[]) => {
  return points.reduce((acc, curr) => acc + curr, 0) + declarations.reduce((acc, curr) => acc + curr, 0);
}

export interface Props {
  rounds: Round[],
  teams: string[],
  setEditIndex: (index: number) => void,
  lastSumIndex: number,
  scoreTarget: number,
  roundActions: RoundActions[]
}

const ScoreBoard: React.FC<Props> = ({ teams, roundActions, scoreTarget, rounds, setEditIndex, lastSumIndex }) => {
  return (
    <>
      <section className={`grid grid-cols-${teams.length} mx-6 mb-8`}>
        {teams.map(name => (
          <TotalPoints
            key={name}
            points={rounds.slice(0, lastSumIndex+1).reduce(
              (sum, round) => sum + round[name].declarations + round[name].points, 0)
            }
            scoreTarget={scoreTarget}
          />
        ))}
      </section>
      <section className="content-box relative h-full overflow-x-hidden py-4 pb-14 mx-6">
        <div className="overflow-y-auto overflow-x-hidden h-full">
          {[...rounds].reverse().map((round, i) => {
            const index = rounds.length - 1 - i;
            return <RoundPoints
              key={index}
              onClickActions={roundActions}
              round={round}
              teams={teams}
              selected={index <= lastSumIndex}
              index={index}
            />
          })}
        </div>
        {/* <div className="absolute bottom-0 w-full h-1/6 mb-14 bg-gradient-to-t from-white" /> */}
      </section>
      <div className="w-full -mt-12 h-24 flex justify-between z-10">
        <div className="placeholder" />
        <div className="mr-20 w-24 h-24">
          <button
            className="outlined-bnt text-primary hover:text-primary-active"
            onClick={() => setEditIndex(rounds.length)}
          >
            <AddIcon className="w-4/6 m-auto" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;