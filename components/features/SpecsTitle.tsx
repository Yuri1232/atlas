import React from "react";
import { ThemedText } from "../ThemedText";
import { MotiView } from "moti";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

const SpecsTitle = ({ children, style }) => {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ThemedText style={style} type="subtitle">
        {children}
      </ThemedText>
    </MotiView>
  );
};

export default SpecsTitle;
