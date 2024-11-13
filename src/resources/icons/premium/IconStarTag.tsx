import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconStarTag(props:any) {
  return (
    <Svg
      width={9}
      height={9}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.5 7.537l2.182 1.381c.4.254.89-.12.784-.594l-.578-2.597 1.93-1.75c.352-.32.163-.924-.3-.963l-2.54-.226L4.984.334a.517.517 0 00-.968 0l-.994 2.449-2.54.226c-.463.038-.652.643-.3.963l1.93 1.75-.578 2.597c-.105.473.384.847.784.594L4.5 7.537z"
        fill="#fff"
      />
    </Svg>
  )
}

export default IconStarTag
