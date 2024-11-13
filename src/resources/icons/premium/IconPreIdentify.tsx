import * as React from "react"
import Svg, { Mask, Path, G } from "react-native-svg"

function IconPreIdentify(props:any) {
  return (
    <Svg
      width={19}
      height={19}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Mask
        id="a"
        style={{
          maskType: "luminance"
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={20}
        height={20}
      >
        <Path
          d="M8.667 16.333A7.666 7.666 0 108.667 1a7.666 7.666 0 000 15.333z"
          fill="#fff"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M11.218 5.665a3.598 3.598 0 00-2.552-1.057 3.597 3.597 0 00-2.55 1.057"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14.178 14.178l3.826 3.827"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Mask>
      <G mask="url(#a)">
        <Path d="M-.805-.804h21.647v21.647H-.805V-.804z" fill="#32A05F" />
      </G>
    </Svg>
  )
}

export default IconPreIdentify
