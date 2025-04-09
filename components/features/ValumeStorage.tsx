import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  I18nManager,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import RenderFeature from "./RenderSpecs";
import SpecsTitle from "./SpecsTitle";
import { useDispatch, useSelector } from "react-redux";
import { colorSetter, ramSetter, storageSetter } from "@/states/ui";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import Loader from "../ui/Loader";

const VolumeStorage = ({ data, availablity, defaultStorage }) => {
  const isRTL = I18nManager.isRTL;
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [unavail, setUnavail] = useState();
  const [lastTap, setLastTap] = useState(0); // Track the last tap time
  const param = useLocalSearchParams();

  const dispatch = useDispatch();
  useEffect(() => {
    const timmer = setTimeout(() => {
      setSelectedColor(defaultStorage);
      dispatch(storageSetter(defaultStorage));
    }, 300);
    console.log("storage render");

    return () => {
      clearImmediate(timmer);
    };
  }, [defaultStorage]);

  // Handle color selection and double-tap
  const handleSelect = useCallback(
    (color: string) => {
      // Toggle selection: if the item is already selected, unselect it
      if (selectedColor === color) {
        setSelectedColor(null); // Unselect color
        requestAnimationFrame(() => dispatch(storageSetter(null))); // Clear selection in state
      } else {
        setSelectedColor(color); // Select new color
        requestAnimationFrame(() => dispatch(storageSetter(color))); // Update the selection in state
      }
    },
    [dispatch, selectedColor]
  );

  useEffect(() => {
    return () => {
      dispatch(colorSetter(null));
      dispatch(ramSetter(null));
      dispatch(storageSetter(null));
    };
  }, []);
  // Check for unavailable items
  useEffect(() => {
    if (!data || !availablity) return;
    const unavailableItems = data?.filter(
      (item) => !availablity?.includes?.(item)
    );
    setUnavail(unavailableItems);
  }, [data, availablity]);

  return (
    <View style={{ gap: 2 }}>
      {data && <SpecsTitle>{isRTL ? "تخزين" : "storage"}</SpecsTitle>}
      <FlatList
        horizontal
        inverted={isRTL}
        contentContainerStyle={{ gap: 20 }}
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

export default VolumeStorage;
