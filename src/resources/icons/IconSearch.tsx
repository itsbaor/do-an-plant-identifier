import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconSearch(props:any) {
  return (
    <Svg
      width={23}
      height={24}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.75 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5z"
        stroke="#5F6466"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <Path
        d="M14.786 15.536L19.5 20.25"
        stroke="#5F6466"
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default IconSearch
