import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IconPruning(props: any) {
  return (
    <Svg
      width={23}
      height={24}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.76 15.908L19.374 1.667m-15.75 0l11.616 14.24M1 18.73a3.937 3.937 0 107.875 0 3.937 3.937 0 00-7.875 0zm13.125 0a3.937 3.937 0 107.874 0 3.937 3.937 0 00-7.874 0z"
        stroke="#32A05F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IconPruning;
