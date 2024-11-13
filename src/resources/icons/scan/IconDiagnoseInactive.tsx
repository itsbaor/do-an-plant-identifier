import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

function IconDiagnoseInactive(props: any) {
  return (
    <Svg
      width={58}
      height={58}
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G opacity={0.8}>
        <Circle cx={28.5735} cy={29.427} r={28.5735} fill="#DFDEDE" />
        <Path
          d="M17.222 16.253a3.636 3.636 0 00-3.644 3.644v18.22a3.636 3.636 0 003.644 3.643h21.864a3.636 3.636 0 003.643-3.644v-18.22a3.636 3.636 0 00-3.643-3.643H17.222zm7.288 3.644h7.288v5.466h5.466v7.288h-5.466v5.465H24.51v-5.465h-5.466v-7.288h5.466v-5.466z"
          fill="#000"
          fillOpacity={0.25}
        />
      </G>
    </Svg>
  );
}

export default IconDiagnoseInactive;
