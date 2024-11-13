import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IconIdentify(props: any) {
  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13 13h3.25a6.5 6.5 0 006.5-6.5V5.417H19.5a6.5 6.5 0 00-6.5 6.5H9.75a6.5 6.5 0 01-6.5-6.5V3.25H6.5a6.5 6.5 0 016.5 6.5v6.5m-5.417 0h10.834v4.333a2.167 2.167 0 01-2.167 2.167h-6.5a2.167 2.167 0 01-2.167-2.167V16.25z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IconIdentify;
