import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconNoCamera(props: any) {
  return (
    <Svg
      width={84}
      height={80}
      viewBox="0 0 84 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M39.895 69.368H10.42A8.42 8.42 0 012 60.947V23.052a8.421 8.421 0 018.421-8.42h4.21a8.42 8.42 0 008.421-8.421A4.21 4.21 0 0127.264 2h25.263a4.21 4.21 0 014.21 4.21 8.42 8.42 0 008.422 8.422h4.21a8.42 8.42 0 018.421 8.42V37.79"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M52.46 41.187A12.631 12.631 0 1042.69 52.22m18.257 21.36L77.79 56.737m-21.053 8.42a12.631 12.631 0 1025.263 0 12.631 12.631 0 00-25.263 0z"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IconNoCamera;
