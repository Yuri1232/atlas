import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/states/ui/cart";
import { Minus, Plus } from "lucide-react-native";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import { MotiView, AnimatePresence } from "moti";
import SpecsTitle from "./SpecsTitle";
import { ThemedText } from "../ThemedText";
import AlertMessage from "./Alert";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const Wrapper = styled(MotiView)`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 8px;
  background-color: ${Colors.light.background};
  padding: 12px;
  width: 140px;
  border-radius: 12px;
  ${Platform.select({
    ios: `
      shadow-color: ${Colors.light.border};
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 3;
    `,
  })}
`;

const Button = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.light.lightGray};
  ${Platform.select({
    ios: `
      shadow-color: ${Colors.light.border};
      shadow-offset: 0px 1px;
      shadow-opacity: 0.1;
      shadow-radius: 2px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

const QuantityText = styled(ThemedText)`
  font-size: 16px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
`;

const Quantity = ({ isRTL, quantity, product, slug }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.cart) || { data: [] };
  const { checkAuth } = useAuthCheck();

  // Extract slug from the product
  const slugs = product?.slug ?? slug;

  // Find item in cart
  const cartItem = data.find((item) => item.slug === slugs);

  // If the item is in the cart, use its quantity; otherwise, start from 1
  const [count, setCount] = useState(cartItem ? cartItem.quantity : 1);

  useEffect(() => {
    // Update count if cartItem changes (e.g., from another component)
    if (cartItem) {
      setCount(cartItem.quantity);
    }
  }, [cartItem]);

  const handleIncrease = () => {
    if (count < quantity) {
      if (cartItem) {
        dispatch(increaseQuantity(slugs));
      } else {
        // ✅ Pass full product details when adding to the cart
        dispatch(addToCart({ product, quantity: 1 })); // Ensure all product details are passed
      }
      setCount((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      if (cartItem) {
        dispatch(decreaseQuantity(slugs));
      }
      setCount((prev) => prev - 1);
    }
  };

  return (
    <View style={{ gap: 4, paddingHorizontal: 16 }}>
      <SpecsTitle>{isRTL ? `كمية:` : "Quantity"}</SpecsTitle>
      <Wrapper>
        <Button
          onPress={handleDecrease}
          disabled={count <= 1}
          style={{ opacity: count <= 1 ? 0.5 : 1 }}
        >
          <Minus
            size={20}
            color={count <= 1 ? Colors.light.placeholder : Colors.light.blue}
          />
        </Button>
        <QuantityText>{count}</QuantityText>
        <Button
          onPress={handleIncrease}
          disabled={count >= quantity}
          style={{ opacity: count >= quantity ? 0.5 : 1 }}
        >
          <Plus
            size={20}
            color={
              count >= quantity ? Colors.light.placeholder : Colors.light.blue
            }
          />
        </Button>
      </Wrapper>
      {quantity > 0 && (
        <AnimatePresence>
          {count === quantity && (
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
          )}
        </AnimatePresence>
      )}
    </View>
  );
};

export default Quantity;
