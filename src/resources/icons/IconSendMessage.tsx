import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IconSendMessage(props: any) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M24.823 2.818c.593-1.643-.999-3.235-2.642-2.64L2.1 7.441c-1.648.597-1.848 2.846-.331 3.725l6.41 3.711 5.724-5.724a1.375 1.375 0 011.945 1.944l-5.725 5.724 3.713 6.41c.877 1.517 3.127 1.316 3.723-.33l7.265-20.083z"
        fill="#32A05F"
        opacity={props.opacity}
      />
    </Svg>
  );
}

export default IconSendMessage;
