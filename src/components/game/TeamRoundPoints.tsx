import React, { useRef, useState } from 'react';

export interface Props {
  points: number,
  declarations: number
}

const TeamRoundPoints: React.FC<Props> = ({ points, declarations }) => {
  const [marginValue, setMarginValue] = useState<number>(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  function callback() {
    if(!!!spanRef.current) {
      setTimeout(callback, 0);
      return;
    }

    const spanWidth = spanRef.current.getBoundingClientRect().width;

    setMarginValue(spanWidth);
  }

  if(!!declarations) setTimeout(callback, 0);

  return (
    <div
      style={{marginRight: `-${marginValue}px`}}
    >
      <span>{points}</span>
      {!!declarations && (
        <span 
          className="text-sm pl-1 align-text-top font-bold top text-primary" 
          ref={spanRef}
        >
          +{declarations}
        </span>
      )}
    </div>
  );
};

export default TeamRoundPoints;