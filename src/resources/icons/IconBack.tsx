import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props: any) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={32} height={32} rx={2.5} fill="#32A05F" />
      <G clipPath="url(#clip0_368_5944)">
        <Path
          d="M10 16a.939.939 0 01.3-.7l9-9a.99.99 0 011.42 0c.4.4.4 1.02 0 1.42l-8.3 8.3 8.28 8.28c.4.4.4 1.02 0 1.42-.4.4-1.02.4-1.42 0l-9-9c-.2-.2-.3-.46-.3-.7L10 16z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_368_5944">
          <Path
            fill="#fff"
            transform="rotate(90 11.5 11.5)"
            d="M0 0H32V14H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
