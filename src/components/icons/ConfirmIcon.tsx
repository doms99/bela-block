import * as React from "react";
import { IconProps } from "../../interfaces";

function ConfirmIconSource({className}: IconProps) {
  return (
    <svg viewBox="0 0 102.92 74.72" className={className}>
      <path
        d="M100.57 13.66L41.86 72.38a8 8 0 01-5.66 2.34h-.48a8 8 0 01-5.1-1.84L2.9 49.94a8 8 0 0110.2-12.33l22.37 18.52L89.26 2.35a8 8 0 0111.31 11.31z"
        data-name="Layer 2"
        className="fill-current"
      />
    </svg>
  );
}

const ConfirmIcon = React.memo(ConfirmIconSource);
export default ConfirmIcon;
