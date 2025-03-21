// import { useEffect } from "react";
// import { Canvas, Circle, Group } from "@shopify/react-native-skia";
// import {
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";
// import { Colors } from "@/constants/Colors";
// import React from "react";
// import { Color } from "three";

// const Loader = () => {
//   const size = 256; // Canvas size
//   const center = size; // Center point

//   // Animated radius values for different expansion speeds
//   const r1 = useSharedValue(0); // Expands to 1/3 of size
//   const r2 = useSharedValue(0); // Expands to 1/2 of size
//   const r3 = useSharedValue(0); // Expands to full size

//   useEffect(() => {
//     r1.value = withRepeat(
//       withTiming(size * 0.33, { duration: 1000 }),
//       -1,
//       true
//     );
//     r2.value = withRepeat(withTiming(size * 0.5, { duration: 1000 }), -1, true);
//     r3.value = withRepeat(withTiming(size * 1, { duration: 1000 }), -1, true);
//   }, [size]);

//   return (
//     <Canvas
//       style={{
//         position: "absolute",
//         zIndex: 11,
//         height: size * 2,
//         width: size * 2,
//         top: "50%",
//         left: "50%",
//         transform: [{ translateX: size }, { translateY: -size }],
//       }}
//     >
//       <Group blendMode="multiply">
//         {/* First circle expands to 1/3 of size */}
//         <Circle cx={center} cy={center} r={r1} color={Colors.light.blue} />
//         {/* Second circle expands to 1/2 of size */}
//         <Circle
//           cx={center}
//           cy={center}
//           r={r2}
//           color={Colors.light.placeholder}
//         />
//         {/* Third circle expands to full size */}
//         <Circle cx={center} cy={center} r={r3} color={Colors.light.border} />
//       </Group>
//     </Canvas>
//   );
// };

// export default Loader;

import { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import styled from "styled-components";
import { transform } from "topojson-client";

const Globe = styled(Animated.Image)`
  height: 100px;
  width: 100px;
  margin: auto;
`;

const Loader = () => {
  const r = useSharedValue(0);

  useEffect(() => {
    r.value = withRepeat(
      withTiming(360, { duration: 1400, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${r.value}deg` }],
  }));
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Globe
        style={[animatedStyle]}
        source={require("@/assets/images/globe.png")}
      />
    </View>
  );
};

export default Loader;
