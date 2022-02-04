import React, { ReactElement } from 'react';
import { useSelector } from '../../../redux/hooks';

export interface Props {
  main: ReactElement,
  bottom: ReactElement,
  flotingRight?: ReactElement,
  floatingLeft?: ReactElement
}

const GameWrapper: React.FC<Props> = ({ main, bottom, children }) => {
  return (
    <div className="h-full">
      <div className="green-backdrop h-3/4 flex flex-col">
        {main}
      </div>
      {bottom}
    </div>
  );
};

export default GameWrapper;
