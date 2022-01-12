import * as React from "react";
import { IconProps } from "../../interfaces";

function Arrow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 147 246" className={className}>
      <g data-name="Layer 2">
        <path
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="round"
          strokeWidth={48}
          d="M123 24l-99 99 99 99"
          data-name="Layer 1"
        />
      </g>
    </svg>
  );
}

export default React.memo(Arrow);
