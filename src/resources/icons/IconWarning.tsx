import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconWarning(props: any) {
  return (
    <Svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M5.216 24.5h17.57c1.796 0 2.916-1.948 2.018-3.5L16.02 5.822c-.898-1.552-3.138-1.552-4.036 0L3.197 21c-.898 1.552.222 3.5 2.019 3.5zM14 16.333a1.17 1.17 0 01-1.167-1.166v-2.334a1.17 1.17 0 011.167-1.166 1.17 1.17 0 011.167 1.166v2.334A1.17 1.17 0 0114 16.333zM15.168 21h-2.334v-2.333h2.334V21z"
        fill="#F4B617"
      />
    </Svg>
  );
}

export default IconWarning;
