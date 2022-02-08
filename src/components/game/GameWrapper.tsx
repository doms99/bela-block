import React, { memo, ReactElement } from 'react';

export interface Props {
  bottom?: ReactElement,
  children?: React.ReactNode
}

const GameWrapper: React.FC<Props> = ({ bottom, children }) => {
  return (
    <div className="h-full overflow-x-hidden flex justify-between flex-col">
      <div className="green-backdrop h-3/4">
        <div className="relative max-w-3xl w-full h-full pt-5 pb-8 mx-auto">
          {children}
        </div>
      </div>
      {bottom && <div className="relative max-w-3xl w-full mx-auto">
        {bottom}
      </div>}
    </div>
  );
};

export default memo(GameWrapper);
