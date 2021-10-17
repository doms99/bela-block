import * as React from "react";
import { IconProps } from "../../interfaces";

function BackspaceIcon({className}: IconProps) {

  return (
    <svg viewBox="0 0 98.59 51.98" className={className}>
      <defs>
        <style>
          {
            `.backspace{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:16px}`
          }
        </style>
      </defs>
      <g id="prefix__Layer_2" data-name="Layer 2">
        <g id="prefix__Layer_2-2" data-name="Layer 2">
          <path
            className="backspace stroke-current"
            d="M8 24.86h82.59M90.59 43.98V24.86M8 24.86L24.86 8M8.04 24.86L24.9 41.73"
          />
        </g>
      </g>
    </svg>
  );
}

export default BackspaceIcon;
