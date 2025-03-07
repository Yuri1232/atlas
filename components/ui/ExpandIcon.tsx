import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { ThemedText } from "../ThemedText";
import { TitleWrapper } from "./Card";
import { I18nManager, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const Expand = ({ category }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: `/products/${category}`,
          params: { headerTitle: category },
        });
      }}
    >
      <TitleWrapper>
        <ThemedText type="subtitle">
          {I18nManager.isRTL ? "شاهد المزيد" : "See more"}
        </ThemedText>
        {I18nManager.isRTL ? (
          <ChevronLeft style={{ marginRight: 5 }} size={20} color="black" />
        ) : (
          <ChevronRight style={{ marginRight: 15 }} size={20} color="black" />
        )}
      </TitleWrapper>
    </TouchableOpacity>
  );
};

export default Expand;
