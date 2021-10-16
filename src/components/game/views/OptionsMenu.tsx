import React from 'react';

export interface Props {
  position: {top: number, left: number},
  onClickOptions?: {name: string, action: () => void}[],
}

const OptionsMenu:React.FC<Props> = ({ position, onClickOptions }) => {
  return (
    <ul
      style={position}
      className="rounded-md absolute pt-1 pb-1 pl-2 pr-2 z-20 bg-primary text-white text-left font-light text-md"
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