import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props:any) {
  return (
    <Svg
      width={31}
      height={31}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M24.219 14.531H4.844a.969.969 0 000 1.938h19.375a.969.969 0 000-1.938z"
        fill="#32A05F"
      />
      <Path
        d="M23.818 15.5l-8.035 8.033a.97.97 0 001.372 1.371l8.719-8.718a.968.968 0 000-1.372l-8.72-8.719a.97.97 0 10-1.37 1.372l8.034 8.033z"
        fill="#32A05F"
      />
    </Svg>
  )
}

export default SvgComponent
