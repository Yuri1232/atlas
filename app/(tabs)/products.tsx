import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  I18nManager,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { productAction } from "@/states/product/product";
import { RenderItem } from "@/components/SearchFilter";
import globalStyles from "@/components/globalStyles";
import Loader from "@/components/ui/Loader";
import { styled } from "styled-components";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled(LinearGradient)`
  padding: 24px 20px;
  padding-top: ${(props) => props.topInset + 24}px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  elevation: 8;
  position: relative;
  overflow: hidden;
`;

const DecorativeIcons = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  opacity: 0.1;
`;

const IconContainer = styled(View)`
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const Title = styled(Text)`
  text-align: center;
  font-size: 32px;
  line-height: 38px;
  position: relative;
  z-index: 111;
  color: #ffffff;
  font-family: "Bold";
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const Subtitle = styled(Text)`
  text-align: center;
  font-size: 16px;
  line-height: 22px;
  position: relative;
  z-index: 111;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Regular";
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Products = () => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState([]);
  const param = useLocalSearchParams();
  const { pData, pStatus } = useSelector((state) => state.products);
  const { locale } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = 150; // Width of each item
  const numColumns = Math.floor(screenWidth / itemWidth);
  console.log(screenWidth - itemWidth * numColumns);
  useEffect(() => {
    dispatch(productAction(locale));
  }, []);

  useEffect(() => {
    if (pStatus === "succeeded" && pData) {
      setProducts(pData.data.map((item) => item?.attributes));
    }
  }, [pStatus, pData]);
  if (pStatus === "loading") {
    return <Loader />;
  }
  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <Header
        colors={["#2563EB", "#1E40AF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        topInset={insets.top}
      >
        <DecorativeIcons>
          <IconContainer style={{ marginTop: 20, marginLeft: 30 }}>
            <Ionicons name="phone-portrait" size={35} color="#FFFFFF" />
          </IconContainer>
          <IconContainer style={{ marginTop: 40, marginRight: 20 }}>
            <Ionicons name="hardware-chip" size={35} color="#FFFFFF" />
          </IconContainer>
          <IconContainer style={{ marginTop: 10, marginLeft: 40 }}>
            <Ionicons name="desktop" size={35} color="#FFFFFF" />
          </IconContainer>
          <IconContainer style={{ marginTop: 30, marginRight: 30 }}>
            <Ionicons name="server" size={35} color="#FFFFFF" />
          </IconContainer>
          <IconContainer style={{ marginTop: 20, marginLeft: 20 }}>
            <Ionicons name="wifi" size={35} color="#FFFFFF" />
          </IconContainer>
          <IconContainer style={{ marginTop: 40, marginRight: 40 }}>
            <Ionicons name="cloud" size={35} color="#FFFFFF" />
          </IconContainer>
        </DecorativeIcons>
        <Title>جميع المنتجات</Title>
        <Subtitle>اكتشف مجموعتنا الكاملة من المنتجات</Subtitle>
      </Header>
      <FlatList
        style={{ position: "relative", zIndex: 1111 }}
        data={products}
        keyExtractor={(item) => item.slug}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
          paddingTop: 50,
          paddingHorizontal: (screenWidth - itemWidth * numColumns - 40) / 2,
        }}
        columnWrapperStyle={{
          marginBottom: 10,
          gap: 40,
          justifyContent: "center",
        }}
        ListFooterComponent={() => {
          const lastRowItems = products.length % numColumns;
          if (lastRowItems > 0) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 40,
                  marginTop: 10,
                }}
              >
                {products.slice(-lastRowItems).map((item, index) => (
                  <RenderItem
                    key={item.slug}
                    item={item}
                    index={products.length - lastRowItems + index}
                  />
                ))}
              </View>
            );
          }
          return null;
        }}
        data={products.slice(
          0,
          Math.floor(products.length / numColumns) * numColumns
        )}
        renderItem={({ item, index }) => {
          return <RenderItem item={item} index={index} />;
        }}
      />
    </Container>
  );
};

export default Products;
