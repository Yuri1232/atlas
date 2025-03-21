import { View } from "react-native";
import SpecsTitle from "./SpecsTitle";
import React from "react";
import { styled } from "styled-components";
import Color from "./Color";
import { Colors } from "@/constants/Colors";
import Animated from "react-native-reanimated";
import { MotiView } from "moti";
import { size } from "@shopify/react-native-skia";

const Wrapper = styled(MotiView)`
  justify-content: center;
  align-self: flex-start;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  flex-shrink: 1;
  background-color: ${Colors.light.blue};
`;

const AlertMessage = ({ children, style }) => {
  return (
    <Wrapper style={style}>
      <SpecsTitle style={{ fontSize: 12, color: "black" }}>
        {children}
      </SpecsTitle>
    </Wrapper>
  );
};

export default AlertMessage;
