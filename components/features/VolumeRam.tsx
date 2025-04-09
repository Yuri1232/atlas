import React, { useCallback, useEffect, useState } from "react";
import { FlatList, I18nManager, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import RenderFeature from "./RenderSpecs";
import SpecsTitle from "./SpecsTitle";
import { useDispatch, useSelector } from "react-redux";
import { colorSetter, ramSetter } from "@/states/ui";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

const VolumeRam = ({ data, availablity, defaultRam }) => {
  const isRTL = I18nManager.isRTL;
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [unavail, setUnavail] = useState();
  const param = useLocalSearchParams();

  const dispatch = useDispatch();
  const handleSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      requestAnimationFrame(() => dispatch(ramSetter(color)));
    },
    [dispatch]
  );

  useEffect(() => {
    setSelectedColor(defaultRam);
    requestAnimationFrame(() => dispatch(ramSetter(defaultRam)));
  }, [defaultRam]);

  useEffect(() => {
    if (!data || !availablity) return;
    const unavailableItems = data?.filter(
      (item) => !availablity.includes(item)
    );

    setUnavail(unavailableItems);
  }, [data, availablity]);

  return (
    <View style={{ gap: 2 }}>
      {data && <SpecsTitle>{isRTL ? "رام" : "color"}</SpecsTitle>}
      <FlatList
        horizontal
        inverted={isRTL}
        contentContainerStyle={{ gap: 20 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5} // Limits rendering batches
        windowSize={7} // Loads fewer items offscreen
        updateCellsBatchingPeriod={50}
        data={[...new Set(data)]}
        renderItem={({ item, index }) => (
          <RenderFeature
            item={item}
            index={index}
            handleSelect={handleSelect}
            onSelect={selectedColor}
            isColor={false}
            paint={{ backgroundColor: Colors.light.lightGray }}
            unavail={unavail}
          />
        )}
      />
    </View>
  );
};

export default VolumeRam;
