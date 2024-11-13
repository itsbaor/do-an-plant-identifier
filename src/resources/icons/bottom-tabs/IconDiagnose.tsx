import React from 'react';
import Svg, {Path} from 'react-native-svg';

//COMPONENT
const IconDiagnose = (props: any) => {
  return (
    <Svg width="22" height="22" viewBox="0 0 29 25" fill="none">
      <Path
        d="M4.30469 0.605469C2.42195 0.605469 0.90625 2.12117 0.90625 4.00391V20.9961C0.90625 22.8788 2.42195 24.3945 4.30469 24.3945H24.6953C26.578 24.3945 28.0938 22.8788 28.0938 20.9961V4.00391C28.0938 2.12117 26.578 0.605469 24.6953 0.605469H4.30469ZM11.1016 4.00391H17.8984V9.10156H22.9961V15.8984H17.8984V20.9961H11.1016V15.8984H6.00391V9.10156H11.1016V4.00391Z"
        fill={props.colors || '#A0A0A0'}
      />
    </Svg>
  );
};

export default IconDiagnose;
