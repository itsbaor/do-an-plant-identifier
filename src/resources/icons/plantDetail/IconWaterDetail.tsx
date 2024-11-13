import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconWaterDetail(props:any) {
  return (
    <Svg
      width={16}
      height={23}
      viewBox="0 0 16 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8 22.333a8 8 0 01-8-8C0 9 8 0 8 0s8 9 8 14.333a8 8 0 01-8 8z"
        fill="#32A05F"
      />
    </Svg>
  )
}

export default IconWaterDetail
