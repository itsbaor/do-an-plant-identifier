import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconRemove(props: any) {
  return (
    <Svg
      width={26}
      height={30}
      viewBox="0 0 26 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M4.875 29.25a3.128 3.128 0 01-2.295-.954A3.136 3.136 0 011.625 26V4.875H0v-3.25h8.125V0h9.75v1.625H26v3.25h-1.625V26c0 .894-.318 1.66-.954 2.296a3.122 3.122 0 01-2.296.954H4.875zm3.25-6.5h3.25V8.125h-3.25V22.75zm6.5 0h3.25V8.125h-3.25V22.75z"
        fill={props.colors || '#D30A0A'}
      />
    </Svg>
  );
}

export default IconRemove;
