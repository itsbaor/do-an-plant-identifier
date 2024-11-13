import * as React from "react";
import Svg, { Mask, Path, G } from "react-native-svg";

function IconGallery(props: any) {
  return (
    <Svg
      width={51}
      height={51}
      viewBox="0 0 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Mask
        id="a"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={51}
        height={51}
      >
        <Path
          d="M45.083 2H5.917A3.917 3.917 0 002 5.917v39.166A3.917 3.917 0 005.917 49h39.166A3.917 3.917 0 0049 45.083V5.917A3.917 3.917 0 0045.083 2z"
          fill="#fff"
          stroke="#fff"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <Path
          d="M2 30.723l13.96-12.798a2.611 2.611 0 013.464-.057l16.52 14.16M30.722 25.5l6.232-6.231a2.612 2.612 0 013.414-.243L49 25.5"
          stroke="#000"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M2 20.277v13.056m47-13.056v13.056"
          stroke="#fff"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Mask>
      <G mask="url(#a)">
        <Path d="M-5.834-5.833h62.667v62.667H-5.834V-5.833z" fill="#fff" />
      </G>
    </Svg>
  );
}

export default IconGallery;
