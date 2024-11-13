import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconPreMinus(props:any) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8 16A8 8 0 108 0a8 8 0 000 16zM2.857 6.857h10.286a.571.571 0 01.571.572V8.57a.571.571 0 01-.571.572H2.857a.571.571 0 01-.571-.572V7.43a.571.571 0 01.571-.572z"
        fill="#32A05F"
      />
    </Svg>
  )
}

export default IconPreMinus
