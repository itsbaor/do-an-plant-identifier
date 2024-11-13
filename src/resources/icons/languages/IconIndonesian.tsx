import * as React from "react"
import Svg, { G, Path, Rect, Defs, ClipPath } from "react-native-svg"

function IconIndonesian(props:any): JSX.Element {
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_35_581)">
        <Path
          d="M13.913 27.125A13.107 13.107 0 0027.038 14H.788a13.107 13.107 0 0013.125 13.125z"
          fill="#EDEDED"
        />
        <Path
          d="M13.913.875A13.107 13.107 0 00.788 14h26.25A13.107 13.107 0 0013.913.875z"
          fill="#ED4C5C"
        />
      </G>
      <Rect
        x={0.5}
        y={0.5}
        width={27}
        height={27}
        rx={13.5}
        stroke="#000"
        strokeOpacity={0.1}
      />
      <Defs>
        <ClipPath id="clip0_35_581">
          <Rect width={28} height={28} rx={14} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default IconIndonesian
