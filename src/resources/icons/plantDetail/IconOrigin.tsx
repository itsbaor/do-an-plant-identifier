import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconOrigin(props:any) {
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
        d="M9 22.5H6.75V21H9v-9.325l-2.637-1.582.772-1.286 2.636 1.581a1.51 1.51 0 01.728 1.287V21A1.502 1.502 0 019 22.5z"
        fill="#4AAF57"
      />
      <Path
        d="M16.5 22.5h-2.25a1.502 1.502 0 01-1.5-1.5v-8.25h4.5a3 3 0 002.986-3.297 3.112 3.112 0 00-3.147-2.703h-1.188l-.132-.584C15.339 4.272 13.523 3 11.25 3a4.515 4.515 0 00-4.081 2.614l-.231.5-.648-.085A2.078 2.078 0 006 6a3 3 0 100 6v1.5a4.5 4.5 0 11.059-9 6.02 6.02 0 015.191-3c2.76 0 5.02 1.483 5.814 3.75h.025a4.623 4.623 0 014.64 4.06 4.5 4.5 0 01-4.479 4.94h-3V21h2.25v1.5z"
        fill="#4AAF57"
      />
    </Svg>
  )
}

export default IconOrigin
