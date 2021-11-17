import React from 'react';

export interface Props {
  onClickOptions?: {name: string, action: () => void}[],
}

const OptionsMenu:React.FC<Props> = ({ onClickOptions }) => {
  return (
    <ul
      className="rounded-md py-2 pl-3 pr-4 z-20 bg-primary text-white text-left font-light text-md"
    >
      {onClickOptions?.map(option => (
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