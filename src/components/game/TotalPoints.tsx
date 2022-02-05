import React, { memo } from 'react';

export interface Props {
  points: number,
  scoreTarget: number,
}

const TotalPoints: React.FC<Props> = ({ points, scoreTarget}) => {
  return (
    <div className="text-center w-full">
      <h1 className="font-extrabold text-4xl mb-2">{points}</h1>
      <h3 className="font-medium text-md">{Math.max(0, scoreTarget - points)}</h3>
    </div>
  );
};

export default memo(TotalPoints);