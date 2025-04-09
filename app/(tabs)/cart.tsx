import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { View } from "react-native";
import Modal from "../modal/cart";
import styled from "styled-components";
const Wrapper = styled(View)`
  padding-bottom: 110px;
  flex: 1;
  background-color: white;
`;
const Cart = () => {
  return (
    <Wrapper>
      <Modal />
    </Wrapper>
  );
};

export default Cart;
