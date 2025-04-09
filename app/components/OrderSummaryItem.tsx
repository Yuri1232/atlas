import React from "react";
import { View, Image, I18nManager } from "react-native";
import styled from "styled-components/native";
import { ThemedText } from "@/components/ThemedText";

interface RTLProps {
  isRTL: boolean;
}

const ItemContainer = styled(View)`
  flex-direction: row;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ItemImage = styled(Image)<RTLProps>`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-${({ isRTL }) => (isRTL ? "left" : "right")}: 12px;
`;

const ItemDetails = styled(View)`
  flex: 1;
  justify-content: space-between;
`;

const ItemHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const QuantityBadge = styled(View)<RTLProps>`
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  margin-${({ isRTL }) => (isRTL ? "left" : "right")}: 8px;
`;

const SpecsContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
  gap: 4px;
`;

const SpecBadge = styled(View)`
  background-color: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
`;

interface OrderSummaryItemProps {
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
  color?: string;
  storage?: string;
  ram?: string;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  name,
  price,
  quantity,
  imageUrl,
  color,
  storage,
  ram,
}) => {
  const isRTL = I18nManager.isRTL;
  const numericValue = parseFloat(price?.replace(/[^\d.,]/g, "")) || 0;
  const totalPrice = numericValue * quantity;

  // Translate specifications to Arabic if they exist
  const translateSpec = (spec: string | undefined) => {
    if (!spec) return undefined;

    // Add translations for common specifications
    const translations: { [key: string]: string } = {
      Black: "أسود",
      White: "أبيض",
      Green: "أخضر",
      Blue: "أزرق",
      Red: "أحمر",
      GB: "جيجابايت",
      TB: "تيرابايت",
      RAM: "رام",
    };

    // Try to translate the spec, if no translation exists, return original
    return translations[spec] || spec;
  };

  const specs = [
    { value: color, type: "color" },
    { value: storage, type: "storage" },
    { value: ram, type: "ram" },
  ].filter((spec) => spec.value);

  return (
    <ItemContainer>
      <ItemImage source={{ uri: imageUrl }} resizeMode="cover" isRTL={isRTL} />
      <ItemDetails>
        <ItemHeader>
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontSize: 14,
                fontFamily: "Medium",
                marginBottom: 4,
                textAlign: isRTL ? "right" : "left",
                color: "#212529",
              }}
              numberOfLines={2}
            >
              {name}
            </ThemedText>
            {specs.length > 0 && (
              <SpecsContainer>
                {specs.map((spec, index) => (
                  <SpecBadge key={index}>
                    <ThemedText
                      style={{
                        fontSize: 12,
                        color: "#6C757D",
                        fontFamily: "Regular",
                      }}
                    >
                      {translateSpec(spec.value)}
                    </ThemedText>
                  </SpecBadge>
                ))}
              </SpecsContainer>
            )}
          </View>
          <QuantityBadge isRTL={isRTL}>
            <ThemedText
              style={{
                fontSize: 12,
                color: "#212529",
                fontFamily: "Medium",
              }}
            >
              {quantity}x
            </ThemedText>
          </QuantityBadge>
        </ItemHeader>
        <ThemedText
          style={{
            fontSize: 14,
            fontFamily: "SemiBold",
            color: "#0066FF",
            marginTop: 4,
          }}
        >
          €{totalPrice.toFixed(2)}
        </ThemedText>
      </ItemDetails>
    </ItemContainer>
  );
};

export default OrderSummaryItem;
