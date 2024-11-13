import React from "react";

import { View, Image } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const IconCheck = (props:any) => {
  return (
    <Svg
      width={35}
      height={35}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path fill="#F8F8F8" d="M0 0H48V48H0z" />
      <Path
        d="M9 26.47L18.242 36 40 11"
        stroke="url(#paint0_linear_1296_3706)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1296_3706"
          x1={9}
          y1={23.5}
          x2={40}
          y2={23.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#32A05F" />
          <Stop offset={1} stopColor="#32A05F" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
};

export default IconCheck;
