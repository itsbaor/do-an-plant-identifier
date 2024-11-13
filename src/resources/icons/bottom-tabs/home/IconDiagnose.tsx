import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconDiagnose(props:any) {
  return (
    <Svg
      width={21}
      height={19}
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M15.75 0C16.997 0 18 .956 18 2.143v10.714C18 14.044 16.997 15 15.75 15H2.25C1.004 15 0 14.044 0 12.857V2.143C0 .956 1.004 0 2.25 0h13.5zm-4.5 2.143h-4.5v3.214H3.375v4.286H6.75v3.214h4.5V9.643h3.375V5.357H11.25V2.143z"
        fill="rgba(255, 255, 255, 1)"
      />
    </Svg>
  )
}

export default IconDiagnose
