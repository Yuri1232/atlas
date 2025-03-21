import React, { useState, useEffect, useCallback } from "react";
import { FlatList, I18nManager, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colorSetter } from "@/states/ui";
import RenderFeature from "./RenderSpecs";
import SpecsTitle from "./SpecsTitle";
import { router, useLocalSearchParams } from "expo-router";

const Color = ({
  data = [],
  defaultColor = "",
}: {
  data: string[];
  defaultColor: string;
}) => {
  const isRTL = I18nManager.isRTL;
  const dispatch = useDispatch();
  const { pData } = useSelector((state) => state.products);
  const param = useLocalSearchParams();
  const slug = param.id.toString();

  // Set the first color as the default selection
  const [selectedColor, setSelectedColor] = useState<string | null>("");

  // Dispatch default color on mount
  useEffect(() => {
    setSelectedColor(defaultColor);
    dispatch(colorSetter(defaultColor));
  }, []);

  // Handle color selection
  const handleSelect = useCallback(
    (color: string) => {
      if (selectedColor === color) return;

      setSelectedColor(color);
      requestAnimationFrame(() => dispatch(colorSetter(color)));

      if (!pData?.data) return;

      const selectedProduct = pData.data.find((item) => param.color === color);

      if (selectedProduct) {
        router.push({
          pathname: `/productDetail/${selectedProduct.attributes.slug}`,
          params: {
            headerTitle: selectedProduct.attributes.name,
            price: selectedProduct.attributes.price,
            discount: selectedProduct.attributes.discount,
          },
        });
      }
    },
    [selectedColor, dispatch, pData]
  );

  return (
    <View style={{ gap: 2 }}>
      {data.length > 0 && <SpecsTitle>{isRTL ? "لون" : "Color"}</SpecsTitle>}
      <FlatList
        horizontal
        inverted={isRTL}
        contentContainerStyle={{ gap: 20 }}
        data={[...new Set(data)]}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <RenderFeature
            item={item}
            index={index}
            handleSelect={handleSelect}
            onSelect={selectedColor}
            isColor
          />
        )}
        extraData={selectedColor} // Prevent unnecessary re-renders
      />
    </View>
  );
};

export default Color;
