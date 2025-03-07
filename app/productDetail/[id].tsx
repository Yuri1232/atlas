import Color from "@/components/features/Color";
import globalStyles from "@/components/globalStyles";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Image, SafeAreaView, View } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components";

const Wrapper = styled(View)`
  height: 290px;
  margin-top: 40px;
`;

const Slide = styled(View)`
  justify-content: center;
  align-items: center;
  width: "100%";
  overflow: hidden;
`;

const TextWrapper = styled(View)`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const ProductDetail = () => {
  return (
    <SafeAreaView style={globalStyles.global}>
      <Wrapper>
        <Swiper
          style={{}}
          loop
          autoplay
          showsPagination
          renderPagination={(index, total) => (
            <ThemedText
              type="subtitle"
              style={{ textAlign: "center" }}
            >{`${index} / ${total - 1}`}</ThemedText>
          )}
        >
          <Slide>
            <Image
              style={{ height: 240, resizeMode: "contain" }}
              source={require("@/assets/images/phone.webp")}
            />
          </Slide>
          <Slide>
            <Image
              style={{ height: 240, resizeMode: "contain" }}
              source={require("@/assets/images/globe.png")}
            />
          </Slide>
          <Slide>
            <Image
              style={{ height: 240, resizeMode: "contain" }}
              source={require("@/assets/images/modal.jpg")}
            />
          </Slide>
        </Swiper>
      </Wrapper>
      <TextWrapper>
        <ThemedText>Model apple iphone 15 pro max</ThemedText>
        <ThemedText>1,837,500</ThemedText>
      </TextWrapper>
      <Color />
    </SafeAreaView>
  );
};

export default ProductDetail;
