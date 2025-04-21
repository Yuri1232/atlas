import React, { useEffect, useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import { ThemedText } from "../ThemedText";
import Quantity from "../features/Quantiy";
import { Trash2 } from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import QuantityCounter from "./QuantityCounter";

const Wrapper = styled(Animated.View)`
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
  padding: 8px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 6px;
`;

const ImageContainer = styled(View)`
  width: 90px;
  height: 110px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fa;
  justify-content: center;
  align-items: center;
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

const ContentContainer = styled(View)`
  flex: 1;
  margin-left: 12px;
  justify-content: space-between;
`;

const ProductName = styled(ThemedText)`
  font-size: 14px;
  font-family: SemiBold;
  color: #212529;
  margin-bottom: 6px;
  line-height: 18px;
`;

const PriceContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
`;

const CurrentPrice = styled(ThemedText)`
  font-size: 16px;
  font-family: Bold;
  color: #0066ff;
`;

const OldPrice = styled(ThemedText)`
  font-size: 12px;
  font-family: Regular;
  color: #dc3545;
  text-decoration-line: line-through;
`;

const FeaturesContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`;

const FeatureTag = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: #f8f9fa;
  padding: 3px 6px;
  border-radius: 6px;
  gap: 3px;
`;

const FeatureLabel = styled(ThemedText)`
  font-size: 11px;
  font-family: Bold;
  color: #212529;
`;

const FeatureValue = styled(ThemedText)`
  font-size: 11px;
  font-family: Regular;
  color: #212529;
`;

const BottomRow = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

const DeleteButton = styled(TouchableOpacity)`
  padding: 6px;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

interface CardProps {
  name: string;
  color?: string;
  price: string;
  discount_price?: string;
  discount?: string;
  imageUrl?: string;
  ram?: string;
  storage?: string;
  onPressHandler: (id: string) => void;
  quantity?: number;
  index: string;
  id: number;
  count: number;
}

const Card: React.FC<CardProps> = ({
  name,
  color,
  price,
  discount_price,
  discount,
  imageUrl,
  ram,
  storage,
  onPressHandler,
  quantity,
  index,
  id,
  count,
  cartId,
}) => {
  const numericValue = price?.replace(/[^\d.,]/g, "");
  const currencySign = price?.replace(/[\d.,]/g, "").trim();
  const numericValueDiscount = discount_price?.replace(/[^\d.,]/g, "");
  const [isLoading, setIsLoading] = useState(true);

  const opacity = useSharedValue(0);

  const priceAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 0 });
    setTimeout(() => {
      opacity.value = withSpring(1, {
        stiffness: 100,
        damping: 20,
      });
    }, 200);
  }, [count]);

  const countSize = count >= 10 ? 30 : 20;

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <Wrapper>
      <QuantityCounter size={countSize}>{count}</QuantityCounter>
      <ImageContainer>
        {isLoading && <ActivityIndicator size="small" color="#0066FF" />}
        <ProductImage
          source={{ uri: process.env.EXPO_PUBLIC_BASE + imageUrl }}
          onLoadStart={handleImageLoadStart}
          onLoadEnd={handleImageLoadEnd}
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      </ImageContainer>
      <ContentContainer>
        <View>
          <ProductName numberOfLines={2}>{name}</ProductName>

          <PriceContainer>
            <CurrentPrice>{price}</CurrentPrice>
            {discount_price && <OldPrice>{discount_price}</OldPrice>}
          </PriceContainer>

          <FeaturesContainer>
            {color && (
              <FeatureTag>
                <FeatureLabel>Color:</FeatureLabel>
                <FeatureValue>{color}</FeatureValue>
              </FeatureTag>
            )}
            {ram && (
              <FeatureTag>
                <FeatureLabel>RAM:</FeatureLabel>
                <FeatureValue>{ram}</FeatureValue>
              </FeatureTag>
            )}
            {storage && (
              <FeatureTag>
                <FeatureLabel>Storage:</FeatureLabel>
                <FeatureValue>{storage}</FeatureValue>
              </FeatureTag>
            )}
          </FeaturesContainer>
        </View>

        <BottomRow>
          <Quantity quantity={quantity} slug={index} cartId={cartId} />
          <DeleteButton onPress={() => onPressHandler(index)}>
            <Trash2 size={20} color="#212529" />
          </DeleteButton>
        </BottomRow>
      </ContentContainer>
    </Wrapper>
  );
};

export default Card;
