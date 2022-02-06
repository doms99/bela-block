import React, { memo, ReactElement } from 'react';

export interface Props {
  main: ReactElement,
  bottom: ReactElement,
  flotingRight?: ReactElement,
  floatingLeft?: ReactElement
}

const GameWrapper: React.FC<Props> = ({ main, bottom, children }) => {
  return (
    <div className="h-full overflow-x-hidden flex justify-between flex-col">
      <div className="green-backdrop h-3/4 flex flex-col">
        {main}
      </div>
      {bottom}
    </div>
  );
};

export default memo(GameWrapper);
