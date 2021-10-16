import * as React from "react";
import IconProps from "../../iconInterface";

function Border2({ className }: IconProps) {
  return (
    <svg viewBox="0 0 803.16 718.55" className={className}>
      <defs>
        <style>
          {
            ".border2{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:25px}"
          }
        </style>
      </defs>
        <path
          className="border2 stroke-current"
          d="M225 12.5C98.85 76.86 12.5 208 12.5 359.28S98.85 641.7 225 706.05M580.18 705c125-64.72 210.48-195.26 210.48-345.76s-85.45-281-210.48-345.76"
        />
    </svg>
  );
}

const MemoBorder2 = React.memo(Border2);
export default MemoBorder2;
