import * as React from "react";
import IconProps from "./iconInterface";

function EditIcon({className}: IconProps) {
  return (
    <svg viewBox="0 0 28.05 40.12" className={className}>
      <rect
        className="fill-current "
        x={21.37}
        y={-0.36}
        width={4.72}
        height={8.29}
        rx={1.17}
        ry={1.17}
        transform="rotate(-57.25 23.726 3.782)"
      />
      <path
        className="fill-current"
        d="M23 10.64a1 1 0 01.31 1.42l-15 23.32a7.83 7.83 0 01-3.12 2.78L1.49 40A1 1 0 010 39l.13-4.1a7.83 7.83 0 011.24-4l15-23.32a1 1 0 011.42-.31z"
      />
    </svg>
  );
}

export default EditIcon;
