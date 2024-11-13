import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconFamily(props:any) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M18.75 1.5a8.257 8.257 0 00-7.684 5.268A5.246 5.246 0 006.75 4.5H4.5v2.25A5.256 5.256 0 009.75 12h.75v6.787a7.442 7.442 0 00-4.553 2.16l1.06 1.06a6.001 6.001 0 019.232.91l1.246-.834A7.486 7.486 0 0012 18.797V12h.75A8.26 8.26 0 0021 3.75V1.5h-2.25zm-9 9A3.754 3.754 0 016 6.75V6h.75a3.754 3.754 0 013.75 3.75v.75h-.75zm9.75-6.75a6.758 6.758 0 01-6.75 6.75H12v-.75A6.758 6.758 0 0118.75 3h.75v.75z"
        fill="#4AAF57"
      />
    </Svg>
  )
}

export default IconFamily
