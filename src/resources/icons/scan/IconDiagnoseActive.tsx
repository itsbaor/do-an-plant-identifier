import * as React from "react"
import Svg, { Circle, Path, G, Defs, ClipPath } from "react-native-svg"

function IconDiagnoseActive(props:any) {
  return (
    <Svg
      width={88}
      height={88}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={44} cy={44} r={34} fill="#C4DBC6" />
      <Path
        d="M31.344 29.234a4.21 4.21 0 00-4.219 4.22v21.093a4.21 4.21 0 004.219 4.219h25.312a4.21 4.21 0 004.219-4.22V33.454a4.21 4.21 0 00-4.219-4.219H31.344zm8.437 4.22h8.438v6.327h6.328v8.438h-6.328v6.328H39.78v-6.328h-6.328V39.78h6.328v-6.328z"
        fill="#4B6D4E"
      />
      <G clipPath="url(#clip0_368_8408)">
        <Path
          d="M44 82.5a38.5 38.5 0 110-77 38.5 38.5 0 010 77zm0 5.5a44 44 0 100-88 44 44 0 000 88z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_368_8408">
          <Path fill="#fff" d="M0 0H88V88H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default IconDiagnoseActive