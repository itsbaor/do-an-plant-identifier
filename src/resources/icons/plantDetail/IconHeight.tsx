import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconHeight(props:any) {
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
        d="M22.059 16.253L7.756 1.935a1.5 1.5 0 00-2.122 0l-3.69 3.697a1.5 1.5 0 000 2.115l14.303 14.318a1.5 1.5 0 001.064.435 1.5 1.5 0 001.058-.435l3.69-3.698a1.5 1.5 0 000-2.114zM17.311 21L3.001 6.69 6.691 3l2.843 2.842L7.846 7.5l1.058 1.057L10.592 6.9l3.097 3.097-1.688 1.688 1.066 1.065 1.687-1.688 3.098 3.098-1.688 1.688 1.087 1.057 1.688-1.688 2.063 2.093-3.69 3.69z"
        fill="#107E56"
      />
    </Svg>
  )
}

export default IconHeight
