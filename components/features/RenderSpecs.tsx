import { Colors } from "@/constants/Colors";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { styled } from "styled-components";
import { ThemedText } from "../ThemedText";
import { AnimatePresence, MotiView } from "moti";
import Animated, { Easing } from "react-native-reanimated";

const Wrapper = styled(MotiView)`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 5px;
  border-radius: 8px;

  background-color: ${Colors.light.lightGray};
  padding: 8px;
  border-width: 2px;
`;

const DisplayColor = styled(View)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
`;

const RenderSpecs = ({
  item,
  index,
  onSelect,
  setOnSelect, // Add state setter for selection
  handleSelect,
  isColor,
  unavail,
}) => {
  const isUnavailable = unavail?.includes(item);
  const isSelected = onSelect === item;

  // Remove selection if the selected item becomes unavailable
  useEffect(() => {
    if (isSelected && isUnavailable) {
      handleSelect(null); // Reset selection
    }
  }, [unavail]); // Run when `unavail` changes

  return (
    <TouchableOpacity
      onPress={() => !isUnavailable && handleSelect(item)}
      disabled={isUnavailable} // Disable if unavailable
    >
      <AnimatePresence>
        <Wrapper
          from={{ borderWidth: 1.5 }}
          animate={{
            borderWidth: isSelected && !isUnavailable ? 2 : 1.5,
            borderColor:
              isSelected && !isUnavailable ? "orange" : Colors.light.border,
          }}
          transition={{
            duration: 100,
            type: "timing",
            easing: Easing.bounce,
          }}
          exit={{ opacity: 0 }}
          style={[
            {
              backgroundColor:
                isSelected && !isUnavailable ? Colors.light.lightGray : "white",
              opacity: isUnavailable ? 0.5 : 1, // Dim unavailable items
            },
          ]}
        >
          {isColor && (
            <DisplayColor style={{ backgroundColor: item?.toLowerCase() }} />
          )}

          {isUnavailable ? (
            <ThemedText
              style={{ textDecorationLine: "line-through" }}
              type={"subtitle"}
            >
              {item}
            </ThemedText>
          ) : (
            <ThemedText type={"subtitle"}>{item}</ThemedText>
          )}
        </Wrapper>
      </AnimatePresence>
    </TouchableOpacity>
  );
};

export default RenderSpecs;
