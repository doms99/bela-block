import React, { memo, ReactElement } from 'react';

export interface Props {
  main: ReactElement,
  bottom: ReactElement,
  flotingRight?: ReactElement,
  floatingLeft?: ReactElement
}

const GameWrapper: React.FC<Props> = ({ main, bottom }) => {
  return (
    <div className="h-full overflow-hidden flex justify-between flex-col md:flex-row">
      <div className="green-backdrop flex flex-col">
        {main}
      </div>
      {bottom}
    </div>
  );
};

export default memo(GameWrapper);
