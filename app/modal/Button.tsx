import React, { useEffect, useState } from "react";
import { I18nManager, TouchableOpacity, View, StyleSheet } from "react-native";

import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ShoppingCart } from "lucide-react-native";
import { router } from "expo-router";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const Wrapper = styled(TouchableOpacity)`
  background-color: rgb(238, 115, 27);
  padding: 10px 10px;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  border-radius: 5px;
  position: absolute;
  bottom: 20px;
  width: 90%;
  right: 10%;
  left: -45%;
`;

const Button = ({ children }) => {
  const { checkAuth } = useAuthCheck();

  const handleCheckout = () => {
    if (checkAuth()) {
      router.push("/checkOut/checkOut");
    }
  };

  return (
    <View
      style={[
        {
          position: "relative",
        },
      ]}
    >
      <Wrapper onPress={handleCheckout}>
        <ThemedText style={{ color: "white" }} type="defaultSemiBold">
          {children}
        </ThemedText>
        <ShoppingCart
          style={{ alignSelf: "flex-start" }}
          size={20}
          color="white"
        />
      </Wrapper>
    </View>
  );
};

export default Button;
