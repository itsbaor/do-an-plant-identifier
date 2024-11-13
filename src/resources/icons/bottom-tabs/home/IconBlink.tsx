import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconBlink(props: any) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M13 9a.986.986 0 01-.651.934l-3.224 1.191-1.187 3.226a.994.994 0 01-1.868 0l-1.195-3.226L1.65 9.937a.995.995 0 010-1.867l3.226-1.195 1.188-3.226a.995.995 0 011.867 0l1.195 3.226 3.226 1.188a.986.986 0 01.65.937zM9.5 3h1v1a.5.5 0 001 0V3h1a.5.5 0 000-1h-1V1a.5.5 0 00-1 0v1h-1a.5.5 0 100 1zM15 5h-.5v-.5a.5.5 0 00-1 0V5H13a.5.5 0 000 1h.5v.5a.5.5 0 001 0V6h.5a.5.5 0 000-1z"
        fill="#fff"
      />
    </Svg>
  );
}

export default IconBlink;
