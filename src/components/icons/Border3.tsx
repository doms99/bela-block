import * as React from "react";
import IconProps from "../../iconInterface";

function Border3({ className }: IconProps) {
  return (
    <svg viewBox="0 0 801.41 762.39" className={className}>
      <defs>
        <style>
          {
            ".border3{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:25px}"
          }
        </style>
      </defs>
        <path
          className="border3 stroke-current"
          d="M173.75 85.3a390.24 390.24 0 01454.35.29M222.77 749.8C107.58 690.65 25.66 575.86 12.5 440.92M788.91 441.26c-13.27 134.86-95.23 249.55-210.41 308.63"
        />
    </svg>
  );
}

export default Border3;
