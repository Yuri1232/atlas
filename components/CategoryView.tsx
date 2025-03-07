import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import styled from "styled-components/native"; // Fix: Ensure `.native`
import { Colors } from "@/constants/Colors";
import { CircleArrowLeft } from "lucide-react-native";
import LinearGradient from "react-native-linear-gradient";
const Wrapper = styled(View)`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const Photo = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Mask = styled(LinearGradient).attrs({
  colors: ["rgba(255,255,255,0.7)", "rgba(0,0,0,0.9)"], // White to Black Gradient
  locations: [0, 1], // 10% White, 90% Black
  start: { x: 1, y: 0 }, // Top
  end: { x: 0.5, y: 1 }, // Bottom// Gradient from white to black
})`
  position: absolute;
  width: 100%;
  height: 150px;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.4;
`;

const Arrow = styled(CircleArrowLeft)`
  position: absolute;
  top: 50%;
  right: 85%;
  z-index: 11;
  color: ${Colors.light.background};
`;

const Title = styled(ThemedText)`
  position: absolute;
  right: 10%;
  bottom: 20%;
  z-index: 111111;
  font-size: 30px;
  line-height: 35;
  color: rgb(255, 255, 255);
`;

const CategoryView = ({ item }) => {
  return (
    <TouchableOpacity>
      <Wrapper style={{ width: "100%" }}>
        <Photo
          source={{
            uri: process.env.EXPO_PUBLIC_BASE + item.logo?.data.attributes?.url,
          }}
        />
        <Mask />
        <Arrow size={35} />
        <Title type="title">{item.category}</Title>
      </Wrapper>
    </TouchableOpacity>
  );
};

export default CategoryView;
