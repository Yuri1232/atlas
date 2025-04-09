import { Colors } from "@/constants/Colors";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { styled } from "styled-components";
import { ThemedText } from "../ThemedText";
const CountWrapper = styled(Animated.View)<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${Colors.light.lightRed};
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
`;
const QuantityCounter = ({ children, size }) => {
  const scale = useSharedValue(0);

  const scaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    scale.value = withTiming(0.5, { duration: 0 });
    setTimeout(() => {
      scale.value = withSpring(1, {
        stiffness: 100,
        damping: 20,
      });
    }, 200);
  }, [children]);

  return (
    <CountWrapper size={size} style={scaleAnimatedStyle}>
      <ThemedText style={{ color: Colors.light.lightGray }} type="subtitle">
        {children}
      </ThemedText>
    </CountWrapper>
  );
};

export default QuantityCounter;
