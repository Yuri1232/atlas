import React from "react";
import { View } from "react-native";
import Svg, {
  Path,
  Defs,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
  G,
} from "react-native-svg";

export default function CurvedTabBarBackground({ color = "white" }) {
  return (
    <Svg width="453" height="91" viewBox="0 0 613 91" fill="none">
      <Path d="M6 1H248.5" stroke="black" />
      <Path d="M369 1L609 1" stroke="black" />
      <Path d="M1 90L241 90" stroke="black" />
      <Path d="M241 90H372.5" stroke="black" />
      <Path d="M372 90L612 90" stroke="black" />
      <G filter="url(#filter0_d_3_13)">
        <Path
          d="M368.953 0.900989C368.966 8.38633 367.413 15.8009 364.384 22.7215C361.355 29.642 356.909 35.9329 351.299 41.235C345.69 46.5372 339.027 50.7467 331.692 53.6232C324.356 56.4997 316.492 57.987 308.547 58C300.602 58.013 292.732 56.5515 285.387 53.699C278.042 50.8465 271.366 46.6588 265.739 41.3751C260.113 36.0914 255.646 29.815 252.594 22.9045C249.543 15.9939 247.966 8.58442 247.953 1.09909"
          stroke="black"
        />
      </G>
      <Path d="M609 1H612" stroke="black" />
      <Path d="M612 0V90" stroke="black" />
      <Path d="M6 1H2.5L1 90" stroke="black" />
      <Defs>
        <Filter
          id="filter0_d_3_13"
          x="243.453"
          y="0.900169"
          width="130"
          height="65.5999"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        ></Filter>
      </Defs>
    </Svg>
  );
}
