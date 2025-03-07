import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  I18nManager,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { productAction } from "@/states/product/product";
import { RenderItem } from "@/components/SearchFilter";
import globalStyles from "@/components/globalStyles";
import Loader from "@/components/ui/Loader";
import { styled } from "styled-components";
import { ThemedText } from "@/components/ThemedText";

const Title = styled(ThemedText)`
  text-align: center;
  font-size: 25px;
  line-height: 30px;
  position: relative;
  z-index: 111;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const param = useLocalSearchParams();
  const { pData, pStatus } = useSelector((state) => state.products);
  const { locale } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = 150; // Width of each item
  const numColumns = Math.floor(screenWidth / itemWidth);
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
    <SafeAreaView style={globalStyles.global}>
      <Title type="subtitle">{I18nManager.isRTL ? "منتجات" : "Products"}</Title>
      <FlatList
        style={{ position: "relative", zIndex: 1111 }}
        data={products}
        keyExtractor={(item) => item.category}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingVertical: 30,
          marginHorizontal: 25,
        }}
        columnWrapperStyle={{
          justifyContent: "center",
          marginBottom: 30,
          gap: 40,
        }} // Add space between columns
        renderItem={({ item, index }) => {
          return <RenderItem item={item} index={index} />;
        }}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 50,
          paddingHorizontal: 15,
        }}
      />
    </SafeAreaView>
  );
};

export default Products;
