import * as React from "react"
import Svg, { Circle, Path, Defs, Pattern, Use, Image } from "react-native-svg"

function IconScan(props:any) {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Circle cx={40} cy={40} r={39.5} fill="#fff" stroke="#ECECEC" />
      <Path fill="url(#pattern0_1280_3675)" d="M0 37H80V80H0z" />
      <Circle cx={40} cy={40} r={34} fill="#32A05F" />
      <Path
        d="M22.9 24.833V34h3.8v-7.333h7.6V23h-9.5c-.504 0-.987.193-1.344.537-.356.344-.556.81-.556 1.296zM57.1 34v-9.167c0-.486-.2-.952-.556-1.296A1.936 1.936 0 0055.2 23h-9.5v3.667h7.6V34h3.8zm-3.8 18.333h-7.6V56h9.5c.504 0 .987-.193 1.343-.537.357-.344.557-.81.557-1.296V45h-3.8v7.333zM34.3 56v-3.667h-7.6V45h-3.8v9.167c0 .486.2.952.556 1.296.357.344.84.537 1.344.537h9.5zM21 37.667h38v3.666H21v-3.666z"
        fill="#fff"
      />
      <Defs>
        <Pattern
          id="pattern0_1280_3675"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use
            xlinkHref="#image0_1280_3675"
            transform="matrix(.00625 0 0 .01163 0 -.86)"
          />
        </Pattern>
        <Image
          id="image0_1280_3675"
          width={160}
          height={160}
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  )
}

export default IconScan
