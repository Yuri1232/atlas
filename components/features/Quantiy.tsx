import React, { useState } from "react";
import SpecsTitle from "./SpecsTitle";
import { Alert, Pressable, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import { AnimatePresence, MotiView } from "moti";
import { Minus, Plus, SquareMinus, SquarePlus } from "lucide-react-native";
import AlertMessage from "./Alert";

const Wrapper = styled(MotiView)`
  justify-content: space-between;
  algin-items: center;
  flex-direction: row;
  gap: 5px;
  background-color: ${Colors.light.lightGray};
  padding: 8px 8px 8px 8px;
  border: 2px solid ${Colors.light.border};
  width: 150px;
`;

const Quantity = ({ isRTL, quantity }) => {
  const [count, setCount] = useState(0);
  const [isSelect, setIsSelect] = useState(false);
  const increase = () => {
    setCount(count + 1);
  };
  const decrease = () => {
    setCount(count - 1);
  };
  return (
    <View style={{ gap: 2 }}>
      <SpecsTitle>{isRTL ? `كمية:` : "Quantity"}</SpecsTitle>
      <Wrapper>
        <TouchableOpacity onPress={decrease}>
          <Minus size={18} disabled={count > 0} />
        </TouchableOpacity>
        <ThemedText>{count}</ThemedText>
        <TouchableOpacity>
          <Plus size={18} disabled={count === quantity} onPress={increase} />
        </TouchableOpacity>
      </Wrapper>
      {quantity > 0 && (
        <AnimatePresence>
          {count === quantity ? (
            <MotiView
              from={{ opacity: 0, translateX: "100%" }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: "100%" }}
              transition={{ type: "timing", duration: 500 }}
            >
              <AlertMessage>
                {isRTL
                  ? "لقد وصلت إلى الحد الأقصى لكمية هذا المنتج"
                  : "You've reached the max quantity of this product"}
              </AlertMessage>
            </MotiView>
          ) : quantity === 0 ? (
            <SpecsTitle style={{ color: Colors.light.lightRed }}>
              Item unavailable
            </SpecsTitle>
          ) : null}
        </AnimatePresence>
      )}
    </View>
  );
};

export default Quantity;
