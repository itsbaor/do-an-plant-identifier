import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconPreChat(props:any) {
  return (
    <Svg
      width={18}
      height={17}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M0 17V1.609C0 1.15.154.768.463.46.772.154 1.156 0 1.615 0h14.77c.46 0 .844.154 1.152.46.308.308.462.69.463 1.149v10.72c0 .458-.154.84-.463 1.148-.309.307-.693.46-1.152.46H3.077L0 17zm3.5-6.547h7v-.996h-7v.996zm0-2.987h11v-.995h-11v.995zm0-2.986h11v-.996h-11v.996z"
        fill="#32A05F"
      />
    </Svg>
  )
}

export default IconPreChat
