import * as React from "react";
import { IconProps } from "../../interfaces";

function AddIconSource({ className }: IconProps) {

  return (
    <svg viewBox="0 0 95.02 95.02" className={className}>
      <g data-name="Layer 2">
        <path
          d="M95 47.51a7.6 7.6 0 01-7.6 7.6H55.11v32.3a7.6 7.6 0 11-15.2 0v-32.3H7.6a7.6 7.6 0 110-15.2h32.31V7.6a7.6 7.6 0 1115.2 0v32.31h32.31a7.6 7.6 0 017.58 7.6z"
          data-name="Layer 1"
          className="fill-current"
        />
      </g>
    </svg>
  );
}

const AddIcon = React.memo(AddIconSource);
export default AddIcon;
