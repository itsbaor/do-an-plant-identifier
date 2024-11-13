import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconLightning(props:any) {
  return (
    <Svg
      width={15}
      height={19}
      viewBox="0 0 15 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.79 0a.681.681 0 00-.625.414L.105 7.62l-.003.007a1.355 1.355 0 00.613 1.71c.196.106.415.162.638.163h2.895l-2.472 8.635a.677.677 0 00.727.861.68.68 0 00.395-.182L14.58 7.767l.004-.004a1.356 1.356 0 00-.924-2.335H9.651L11.876.983A.678.678 0 0011.271 0H3.79z"
        fill={props.torch === 'on' ? "rgba(50, 160, 95, 1)" : "#FFFFFF"}
      />
    </Svg>
  )
}

export default IconLightning
