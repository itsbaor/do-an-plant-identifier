import * as React from "react";
import Svg, { Rect } from "react-native-svg";

function CheckBoxOutline(props: any) {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.5}
        y={0.5}
        width={21}
        height={21}
        rx={4.5}
        fill="#fff"
        stroke="#4B6D4E"
      />
    </Svg>
  );
}

export default CheckBoxOutline;
