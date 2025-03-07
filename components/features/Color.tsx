import React, { useState } from "react";
import { FlatList, I18nManager, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";

const data = ["red", "blue", "red", "Black red"];
const Wrapper = styled(View)`
  justify-content: center;
  algin-items: center;
  flex-direction: row;
  gap: 5px;
  border-radius: 10px;
  background-color: ${Colors.light.border};
  padding: 5px 8px 5px 8px;
  border-width: 1px;
`;
const DisplayColor = styled(View)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid black;
`;
const RenderColors = ({ item, index, onSelect, handleSelect }) => {
  return (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Wrapper
        style={{
          borderColor:
            onSelect === item ? Colors.light.lightRed : "transparent",
        }}
      >
        <DisplayColor style={{ backgroundColor: item.toLowerCase() }} />
        <ThemedText type="subtitle">{item}</ThemedText>
      </Wrapper>
    </TouchableOpacity>
  );
};

const Color = () => {
  const isRTL = I18nManager.isRTL;
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelect = (color: string) => {
    setSelectedColor(color);
  };
  console.log(selectedColor);
  return (
    <View>
      <ThemedText>{isRTL ? "اللون" : "color"}</ThemedText>
      <FlatList
        horizontal
        inverted={isRTL}
        contentContainerStyle={{ gap: 20 }}
        data={data}
        renderItem={({ item, index }) => (
          <RenderColors
            item={item}
            index={index}
            handleSelect={handleSelect}
            onSelect={selectedColor}
          />
        )}
      />
    </View>
  );
};

export default Color;
