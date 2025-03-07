import CategoryView from "@/components/CategoryView";
import globalStyles from "@/components/globalStyles";
import { ThemedText } from "@/components/ThemedText";
import Loader from "@/components/ui/Loader";
import { homeAction } from "@/states/home/home";
import { RootState } from "@/states/store";
import { HeaderTitileSetter } from "@/states/ui";
import { Canvas, Patch, vec } from "@shopify/react-native-skia";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { FlatList, I18nManager, SafeAreaView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";

const Title = styled(ThemedText)`
  text-align: center;
  font-size: 25px;
  line-height: 30px;
  position: relative;
  z-index: 111;
`;

const Categories = () => {
  const colors = ["#61dafb", "#fb61da", "#61fbcf", "#dafb61"];
  const C = 104;
  const width = 410;
  const topLeft = { pos: vec(0, 0), c1: vec(0, C), c2: vec(C, 0) };
  const topRight = {
    pos: vec(width, 0),
    c1: vec(width, C),
    c2: vec(width + C, 0),
  };
  const bottomRight = {
    pos: vec(width, width),
    c1: vec(width, width - 2 * C),
    c2: vec(width - 2 * C, width),
  };
  const bottomLeft = {
    pos: vec(0, width),
    c1: vec(0, width - 2 * C),
    c2: vec(-2 * C, width),
  };
  const [cat, setCat] = useState([]);
  const param = useLocalSearchParams();
  const { data, status } = useSelector((state: RootState) => state.home);
  const { locale } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(HeaderTitileSetter(param.id));
    dispatch(homeAction(locale));
  }, []);

  useEffect(() => {
    if (status === "succeeded" && data) {
      const categories = data.card;

      setCat(categories);
    }
  }, [status, data]);

  if (status === "loading") {
    return <Loader />;
  } else {
    return (
      <SafeAreaView style={globalStyles.global}>
        <Canvas
          style={{
            height: 4000,
            width: width,
            position: "absolute",
            zIndex: 11,
            left: 0,
            top: "20%",
          }}
        >
          <Patch
            colors={colors}
            patch={[topLeft, topRight, bottomRight, bottomLeft]}
          />
        </Canvas>
        <Title type="subtitle">
          {I18nManager.isRTL ? "الفئات" : "Categories"}
        </Title>
        <FlatList
          style={{ position: "relative", zIndex: 1111 }}
          data={cat}
          keyExtractor={(item) => item.category}
          contentContainerStyle={{
            flex: 1,
            paddingVertical: 30,
            marginHorizontal: 25,
            gap: 20,
          }}
          renderItem={({ item, index }) => {
            return <CategoryView item={item} />;
          }}
        />
      </SafeAreaView>
    );
  }
};

export default Categories;
