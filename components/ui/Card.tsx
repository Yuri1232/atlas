import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components";
import { ThemedText } from "../ThemedText";
import Svg, { Path, Rect } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import Animated, { Easing } from "react-native-reanimated";
import { Image } from "expo-image";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { MotiView } from "moti";
import Expand from "./ExpandIcon";
import { router } from "expo-router";

interface Item {
  id: string;
  price: string;
  description: string;
  photo: {
    url: string;
  };
  category: string;
  discount: boolean;
  discount_price: string;
  name: string;
}

interface CardProps {
  data: Item[];
  style?: object;
  cat?: string;
  isDiscount?: boolean;
}

//style
const Wrapper = styled(View)`
  flex: 1;
`;

const CardWrap = styled(MotiView)`
  padding: 0 0 10px 0;
  align-self: flex-start;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background: white;
  width: 150px;
  height: 100%;
  overflow: hidden;
  gap: 5px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;
const Price = styled(ThemedText)`
  color: ${Colors.dark.price};
`;

export const TitleWrapper = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5px;
`;

export const PriceHandler = ({
  isDiscount,
  item,
}: {
  isDiscount: boolean;
  item: Item;
}) => {
  if (isDiscount) {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Price type="title">{item.discount_price}</Price>
        <ThemedText
          style={{
            textDecorationLine: "line-through",
            color: "red",
            fontFamily: "Regular",
          }}
          type="title"
        >
          {item.price}
        </ThemedText>
      </View>
    );
  }
  return <Price type="title">{item.price}</Price>;
};

export const CardRender = ({ item, index }: { item: Item; index: number }) => {
  const [photo, setPhoto] = useState<string>("");

  useEffect(() => {
    if (item) {
      setPhoto(
        process.env.EXPO_PUBLIC_BASE + item.image?.data[0].attributes.url
      );
    }
  }, [item]);
  return (
    <CardWrap
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "timing",
        delay: index * 100,
      }}
      style={styles.box}
      key={index}
    >
      <View style={{ width: "100%" }}>
        {item.discount && (
          <Svg
            style={{ position: "absolute", right: 4, top: 4, zIndex: 1 }}
            width="24"
            height="24"
            viewBox="0 0 426 426"
            fill="none"
          >
            <Rect
              x="57.6064"
              y="58.6206"
              width="310.789"
              height="307.771"
              rx="7"
              fill="#F34336"
            ></Rect>
            <Rect
              x="161.334"
              width="310.789"
              height="307.771"
              rx="7"
              transform="rotate(31.6145 161.334 0)"
              fill="#F34336"
            ></Rect>
            <Rect
              x="273.351"
              y="2.30127"
              width="310.789"
              height="307.771"
              rx="7"
              transform="rotate(61.2985 273.351 2.30127)"
              fill="#F34336"
            ></Rect>
            <Path
              d="M193.826 204.428C185.895 209.886 175.66 212.615 163.123 212.615C150.586 212.615 140.309 209.886 132.292 204.428C124.361 198.884 120.395 189.929 120.395 177.562V165.025C120.395 152.659 124.361 143.704 132.292 138.16C140.309 132.617 150.586 129.845 163.123 129.845C175.66 129.845 185.895 132.617 193.826 138.16C201.843 143.618 205.852 152.574 205.852 165.025V177.562C205.852 189.929 201.843 198.884 193.826 204.428ZM145.853 309.33C142.015 309.33 139.371 307.795 137.921 304.725C136.557 301.654 137.111 298.669 139.584 295.77L259.582 139.823C261.288 137.179 262.738 135.516 263.932 134.834C265.211 134.152 267.045 133.811 269.433 133.811H285.168C289.006 133.811 291.607 135.388 292.972 138.544C294.422 141.7 293.953 144.727 291.565 147.627L174.125 300.887C171.481 304.554 169.221 306.899 167.345 307.923C165.554 308.861 162.825 309.33 159.157 309.33H145.853ZM145.085 176.283C145.085 186.944 151.098 192.274 163.123 192.274C175.149 192.274 181.161 186.944 181.161 176.283V166.305C181.161 155.644 175.149 150.313 163.123 150.313C151.098 150.313 145.085 155.644 145.085 166.305V176.283ZM268.409 313.296C255.872 313.296 245.595 310.567 237.578 305.108C229.647 299.565 225.681 290.567 225.681 278.115V265.578C225.681 253.212 229.647 244.299 237.578 238.841C245.595 233.297 255.872 230.525 268.409 230.525C281.202 230.525 291.565 233.297 299.496 238.841C307.428 244.299 311.394 253.212 311.394 265.578V278.115C311.394 290.482 307.428 299.437 299.496 304.98C291.565 310.524 281.202 313.296 268.409 313.296ZM268.409 292.827C280.605 293.168 286.746 287.838 286.831 276.836V266.857C286.831 256.197 280.691 250.866 268.409 250.866C256.384 250.866 250.371 256.197 250.371 266.857V276.836C250.371 287.497 256.384 292.827 268.409 292.827Z"
              fill="white"
            ></Path>
          </Svg>
        )}
        <Image
          style={{
            width: "100%",
            height: 160,
          }}
          source={{ uri: photo }}
        />
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          paddingHorizontal: 10,
          gap: 5,
        }}
      >
        <ThemedText numberOfLines={2} style={{ flex: 1 }} type="subtitle">
          {item.name}
        </ThemedText>
        <PriceHandler isDiscount={item.discount} item={item} />
      </View>
    </CardWrap>
  );
};

const Card = ({ data, style, cat, isDiscount }: CardProps) => {
  const [stream, setStream] = useState<Item[]>([]);
  const isRTL = I18nManager.isRTL;
  const offer = isRTL ? "العروض" : "Offer";

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current && isRTL) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100); // Small delay to ensure it calculates content size
    }
  }, [stream, isRTL]); // Runs when the data is loaded

  useEffect(() => {
    if (data) {
      if (cat == null) {
        setStream(data);
      } else {
        const filteredResult = data.filter(
          (item: Item) => item?.category === cat
        );
        setStream(filteredResult);
      }
    }
  }, [data]);
  useEffect(() => {
    // Prefetching is not supported, so this effect is removed
  }, []);
  const handlePress = useCallback(
    (item: Item) => {
      console.log("Navigating to", item.slug);
      router.push({
        pathname: `/productDetail/${item.slug}`,
        params: {
          headerTitle: item.name,
          price: item.price,
          discount: item.discount_price,
          color: item.features.color,
          ram: item.features.ram,
          storage: item.features.storage,
        },
      });
    },
    [router]
  );

  return (
    <Wrapper>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TitleWrapper>
          <ThemedText
            type="defaultSemiBold"
            style={{
              marginLeft: 5,
              marginRight: isRTL ? 5 : 0,

              verticalAlign: "middle",
            }}
          >
            {isDiscount ? offer : cat}
          </ThemedText>
          {isDiscount && (
            <Image
              style={{
                width: 20,
                height: 20,

                alignSelf: "flex-start",
              }}
              source={require("../../assets/images/fire.gif")}
            />
          )}
        </TitleWrapper>
        <Expand category={isDiscount ? offer : cat} />
      </View>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={[{ gap: 16 }, style]}
        showsHorizontalScrollIndicator={false}
        inverted={isRTL} // Scroll
        horizontal
        data={stream}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <CardRender key={item.id} item={item} index={index} />
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  box: {
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    // Android shadow
    elevation: 0.7,
  },
});

export default Card;
