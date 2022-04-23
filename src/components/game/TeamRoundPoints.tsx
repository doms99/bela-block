import React, { memo, useCallback } from 'react';

export interface Props {
  points: number,
  declarations: number
}

const TeamRoundPoints: React.FC<Props> = ({ points, declarations }) => {
  const spanRef = useCallback((ref: null | HTMLDivElement) => {
    if(ref == null) return;

    const width = ref.offsetWidth;
    ref.parentElement!.style.marginRight = `-${width}px`
  }, []);

  return (
    <div>
      <span>{points}</span>
      {!!declarations && (
        <span
          className="text-sm pl-1 align-text-top font-bold text-primary"
          ref={spanRef}
        >
          +{declarations}
        </span>
      )}
    </div>
  );
};

export default memo(TeamRoundPoints);