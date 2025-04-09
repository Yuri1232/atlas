import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  I18nManager,
} from "react-native";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { ThemedText } from "@/components/ThemedText";
import { SearchOpen } from "@/components/Search";
import { useSelector } from "react-redux";
import { RootState } from "@/states/store";

const { height } = Dimensions.get("window");

const Container = styled(View)`
  flex: 1;
  background-color: white;
`;

const Backdrop = styled(MotiView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const SearchContent = styled(MotiView)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  min-height: 200px;
  max-height: 95%;
  background-color: white;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding: 24px;
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled(ThemedText)`
  font-size: 24px;
  font-family: "Bold";
  color: #1a1a1a;
  line-height: 30px;
`;

const CloseButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
`;

export default function SearchScreen() {
  const router = useRouter();
  const { pData } = useSelector((state: RootState) => state.products);
  const products = pData?.data?.map((item) => item.attributes) || [];

  return (
    <Container>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => router.back()}
      >
        <Backdrop
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 200 }}
        />
      </TouchableOpacity>
      <SearchContent>
        <Header>
          <Title>
            {I18nManager.isRTL ? "البحث عن المنتجات" : "Search Products"}
          </Title>
          <CloseButton onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#666" />
          </CloseButton>
        </Header>
        <SearchOpen
          data={products}
          isSearch={true}
          onPress={() => router.back()}
          style={{ flex: 1 }}
        />
      </SearchContent>
    </Container>
  );
}
