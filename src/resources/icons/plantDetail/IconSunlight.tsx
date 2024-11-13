import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconSunlight(props:any) {
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
        d="M12 9.004a3 3 0 110 6 3 3 0 010-6zm0-1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM4.047 5.11l1.06-1.06 2.63 2.628-1.06 1.061-2.63-2.63zM1.5 11.254h3.75v1.5H1.5v-1.5zM4.047 18.898l2.63-2.63 1.06 1.061-2.63 2.63-1.06-1.06zM11.25 18.754h1.5v3.75h-1.5v-3.75zM16.266 17.329l1.06-1.06 2.63 2.629-1.061 1.06-2.63-2.629zM18.75 11.254h3.75v1.5h-3.75v-1.5zM16.266 6.678l2.629-2.63 1.06 1.061-2.629 2.63-1.06-1.061zM11.25 1.504h1.5v3.75h-1.5v-3.75z"
        fill="#FF8F66"
      />
    </Svg>
  )
}

export default IconSunlight
