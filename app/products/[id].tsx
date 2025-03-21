import Card, { CardRender } from "@/components/ui/home/Card";
import { homeAction } from "@/states/home/home";
import { productAction } from "@/states/product/product";
import { RootState } from "@/states/store";
import { HeaderTitileSetter } from "@/states/ui";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Categories from "../(tabs)/categories";
import Category, { CategoryRender } from "@/components/ui/Category";
import { RenderItem } from "@/components/SearchFilter";
import CategoryView from "@/components/CategoryView";
import Loader from "@/components/ui/Loader";
import globalStyles from "@/components/globalStyles";

const Products = () => {
  const param = useLocalSearchParams();
  const dispatch = useDispatch();
  const { pData, pStatus } = useSelector((state: RootState) => state.products);
  const { data, status } = useSelector((state: RootState) => state.home);
  const { locale } = useSelector((state: RootState) => state.ui);
  const [card, setCard] = useState([]);
  const [cat, setCat] = useState([]);
  const isCat = param.id === "Categories" || param.id === "فئات";
  const isOffer = param.id === "offer" || param.id === "العروض";
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = 150; // Width of each item
  const numColumns = Math.floor(screenWidth / itemWidth);

  useEffect(() => {
    dispatch(HeaderTitileSetter(param.id));
    dispatch(productAction(locale));
    dispatch(homeAction(locale));
  }, []);

  useEffect(() => {
    if (pStatus === "succeeded" && pData) {
      const card = pData.data.map((item) => item.attributes.product);

      if (isOffer) {
        setCard(card.filter((item) => item.discount === true));
      } else {
        setCard(card.filter((item) => item.category === param.id));
      }
    }
  }, [pStatus, pData]);

  useEffect(() => {
    if (status === "succeeded" && data) {
      const categories = data.card;
      if (isCat) {
        setCat(categories);
      }
    }
  }, [status, data, isCat]);

  const adjustedItems =
    card.length % 2 !== 0 ? [...card, { isPlaceholder: true }] : card;
  if (status === "loading") {
    return <Loader />;
  } else {
    return (
      <SafeAreaView style={globalStyles.global}>
        <FlatList
          style={{ position: "relative", zIndex: 1111 }}
          data={adjustedItems}
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
            if (isCat) {
              return <CategoryView item={item} />;
            } else {
              return <RenderItem item={item} index={index} />;
            }
          }}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 50,
            paddingHorizontal: 15,
          }}
        />
      </SafeAreaView>
    );
  }
};

export default Products;
