import React, { useRef } from 'react';

export interface Props {
  points: number,
  declarations: number
}

const TeamRoundPoints: React.FC<Props> = ({ points, declarations }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  function callback() {
    if(!spanRef.current || !divRef.current) {
      setTimeout(callback, 0);
      return;
    }

    const spanWidth = spanRef.current.getBoundingClientRect().width;
    divRef.current.style.marginRight = `-${spanWidth}px`
  }

  if(!!declarations) setTimeout(callback, 0);

  return (
    <div ref={divRef}>
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

export default TeamRoundPoints;