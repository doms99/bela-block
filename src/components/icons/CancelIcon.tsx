import * as React from "react";
import IconProps from "../../iconInterface";

function CancelIcon({className}: IconProps) {

  return (
    <svg viewBox="0 0 81.62 81.62" className={className}>
      <defs>
        <style>
          {
            `.cancel{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:16px}`
          }
        </style>
      </defs>
      <g id="prefix__Layer_2" data-name="Layer 2">
        <g id="prefix__Layer_2-2" data-name="Layer 2">
          <path
            className="cancel stroke-current "
            d="M8 73.62L73.62 8M8 8l65.62 65.62"
          />
        </g>
      </g>
    </svg>
  );
}

export default CancelIcon;
