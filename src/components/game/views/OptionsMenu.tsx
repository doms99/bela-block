import React from 'react';

export interface Props {
  onClickOptions: {name: string, action: () => void}[],
}

const OptionsMenu:React.FC<Props> = ({ onClickOptions }) => {
  return (
    <ul
      className={`py-1 text-center w-full grid grid-cols-${onClickOptions.length}`}
    >
      {onClickOptions.map(option => (
        <li className="hover:text-primary-active" key={option.name}>
          <button id="round-points" onClick={option.action}>
            {option.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default OptionsMenu;