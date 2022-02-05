import React from 'react';
import Players1 from '../../icons/Players1';

export interface Props {
  name: string,
  playerNumber: number,
  setName: (name: string, playerNum: number) => void,
  error: boolean,
}

const PlayerBox: React.FC<Props> = ({ name, setName, playerNumber, error }) => {
  const hint = `Player ${playerNumber}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value, playerNumber);
  }

  return (
    <div
      className={`border-transparent focus-within:border-white border-8
                  flex justify-center items-center flex-col
                  text-center w-32 h-32 rounded-full bg-primary`}
    >
      <Players1 className={`${error ? "text-error" : "text-white"} mb-2 h-6`} />
      <input
        type="text"
        name={hint}
        placeholder={hint}
        value={name}
        className="appearance-none rounded-xl p-1 placeholder-white font-medium w-28 bg-transparent focus:outline-none text-white text-center"
        onChange={handleChange}
      />
    </div>
  );
};

export default React.memo(PlayerBox);