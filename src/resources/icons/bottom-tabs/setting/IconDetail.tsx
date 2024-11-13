import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconDetail(props:any) {
  return (
    <Svg
      width={18}
      height={16}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.829 1.293a.947.947 0 00-.33.707c0 .265.12.52.33.707l5.569 4.95-5.569 4.95a.944.944 0 00-.316.703c.003.262.121.513.33.699.208.185.49.29.785.293.295.002.58-.1.792-.281l6.364-5.657a.947.947 0 00.33-.707.947.947 0 00-.33-.707L6.42 1.293A1.2 1.2 0 005.624 1a1.2 1.2 0 00-.795.293z"
        fill="#000"
      />
    </Svg>
  )
}

export default IconDetail
