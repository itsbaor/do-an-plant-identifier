import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CheckBoxTic(props: any) {
  return (
    <Svg
      width={15}
      height={11}
      viewBox="0 0 15 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.512.387a1.265 1.265 0 011.806 1.772l-6.733 8.42a1.265 1.265 0 01-1.823.034L1.297 6.148a1.266 1.266 0 111.79-1.789L6.62 7.891 12.48.424l.032-.037z"
        fill="#4B6D4E"
      />
    </Svg>
  );
}

export default CheckBoxTic;
