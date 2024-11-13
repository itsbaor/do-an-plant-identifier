import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconRate(props:any) {
  return (
    <Svg
      width={19}
      height={18}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5.914 14.505l3.165-2.399 3.165 2.399-1.187-3.954 2.967-2.075h-3.692L9.079 4.457l-1.253 4.02H4.134L7.1 10.55l-1.187 3.954zM3.396 18l2.128-6.91L0 7.18h6.878L9.078 0l2.203 7.18h6.877l-5.524 3.91L14.762 18 9.08 13.753 3.395 18z"
        fill="#000"
      />
    </Svg>
  )
}

export default IconRate
