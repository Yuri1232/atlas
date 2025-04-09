import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.98);
`;

const LoaderContainer = styled(View)`
  align-items: center;
  justify-content: center;
`;

const Globe = styled(Animated.Image)`
  height: 80px;
  width: 80px;
`;

const Ring = styled(Animated.View)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  position: absolute;
  border-width: 2px;
  border-color: ${Colors.dark.blue};
`;

const Loader = () => {
  // Rotation animation
  const rotation = useSharedValue(0);
  // Scale animation for the globe
  const scale = useSharedValue(1);
  // Ring animations
  const ring1Scale = useSharedValue(0);
  const ring1Opacity = useSharedValue(1);
  const ring2Scale = useSharedValue(0);
  const ring2Opacity = useSharedValue(1);

  useEffect(() => {
    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Subtle scale animation for the globe
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        withTiming(1, {
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      ),
      -1,
      true
    );

    // Ring animations
    const animateRing = (ringScale: any, ringOpacity: any, delay: number) => {
      ringScale.value = 0;
      ringOpacity.value = 1;
      ringScale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.5, { duration: 1000 }),
            withTiming(1.8, { duration: 1000 })
          ),
          -1,
          false
        )
      );
      ringOpacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.8, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          false
        )
      );
    };

    animateRing(ring1Scale, ring1Opacity, 0);
    animateRing(ring2Scale, ring2Opacity, 1000);
  }, []);

  const globeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{ scale: ring1Scale.value }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{ scale: ring2Scale.value }],
  }));

  return (
    <Container>
      <LoaderContainer>
        <Ring style={ring1Style} />
        <Ring style={ring2Style} />
        <Globe
          style={globeStyle}
          source={require("@/assets/images/globe.png")}
        />
      </LoaderContainer>
    </Container>
  );
};

export default Loader;
