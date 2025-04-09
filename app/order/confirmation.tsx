import { ThemedText } from "../../components/ThemedText";
import {
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
  ScrollView,
} from "react-native";
import styled from "styled-components/native";
import {
  CheckCircle,
  ChevronRight,
  Package,
  Truck,
  CreditCard,
  MapPin,
} from "lucide-react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #fafbfc;
`;

const Container = styled(ScrollView)`
  flex: 1;
  padding: 16px;
`;

const SuccessContainer = styled(View)`
  align-items: center;
  justify-content: center;
  padding: 32px 0;
`;

const SuccessIcon = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #d1fae5;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const OrderNumber = styled(ThemedText)`
  font-size: 24px;
  font-family: "Bold";
  color: #212529;
  margin-bottom: 8px;
`;

const OrderStatus = styled(ThemedText)`
  font-size: 16px;
  color: #10b981;
  margin-bottom: 24px;
`;

const Section = styled(View)`
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.08;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 3;
    `,
  })}
`;

const SectionTitle = styled(ThemedText)`
  font-size: 18px;
  font-family: "SemiBold";
  color: #212529;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f3f5;
`;

const InfoRow = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f3f5;
`;

const InfoContent = styled(View)`
  flex: 1;
  margin-${(props) => (I18nManager.isRTL ? "right" : "left")}: 12px;
`;

const InfoTitle = styled(ThemedText)`
  font-size: 16px;
  font-family: "Medium";
  color: #212529;
  margin-bottom: 4px;
`;

const InfoDescription = styled(ThemedText)`
  font-size: 14px;
  color: #6c757d;
`;

const ContinueButton = styled(TouchableOpacity)`
  overflow: hidden;
  border-radius: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const Confirmation = () => {
  const params = useLocalSearchParams();
  const orderNumber = (params.orderNumber as string) || "ORD123456";
  const total = (params.total as string) || "1,299.00";
  const paymentMethod = (params.paymentMethod as string) || "بطاقة ائتمان";
  const shippingAddress =
    (params.shippingAddress as string) || "الرياض، المملكة العربية السعودية";
  const estimatedDelivery =
    (params.estimatedDelivery as string) || "3-5 أيام عمل";

  const handleContinueShopping = () => {
    router.push("/(tabs)");
  };

  return (
    <SafeContainer>
      <Container>
        <SuccessContainer>
          <SuccessIcon>
            <CheckCircle size={40} color="#10b981" />
          </SuccessIcon>
          <OrderNumber>شكراً لطلبك!</OrderNumber>
          <OrderStatus>تم تأكيد طلبك بنجاح</OrderStatus>
        </SuccessContainer>

        <Section>
          <SectionTitle>تفاصيل الطلب</SectionTitle>
          <InfoRow>
            <Package size={24} color="#0066FF" />
            <InfoContent>
              <InfoTitle>رقم الطلب</InfoTitle>
              <InfoDescription>{orderNumber}</InfoDescription>
            </InfoContent>
          </InfoRow>
          <InfoRow>
            <CreditCard size={24} color="#0066FF" />
            <InfoContent>
              <InfoTitle>طريقة الدفع</InfoTitle>
              <InfoDescription>{paymentMethod}</InfoDescription>
            </InfoContent>
          </InfoRow>
          <InfoRow>
            <MapPin size={24} color="#0066FF" />
            <InfoContent>
              <InfoTitle>عنوان الشحن</InfoTitle>
              <InfoDescription>{shippingAddress}</InfoDescription>
            </InfoContent>
          </InfoRow>
          <InfoRow>
            <Truck size={24} color="#0066FF" />
            <InfoContent>
              <InfoTitle>موعد التسليم المتوقع</InfoTitle>
              <InfoDescription>{estimatedDelivery}</InfoDescription>
            </InfoContent>
          </InfoRow>
        </Section>

        <Section>
          <SectionTitle>ملخص الدفع</SectionTitle>
          <InfoRow>
            <InfoContent>
              <InfoTitle>المجموع الكلي</InfoTitle>
              <InfoDescription>{total} ريال</InfoDescription>
            </InfoContent>
          </InfoRow>
        </Section>

        <ContinueButton onPress={handleContinueShopping}>
          <LinearGradient
            colors={["#0066FF", "#0055FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ThemedText
              style={{
                color: "white",
                fontSize: 16,
                fontFamily: "SemiBold",
              }}
            >
              متابعة التسوق
            </ThemedText>
            <ChevronRight
              size={20}
              color="white"
              style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            />
          </LinearGradient>
        </ContinueButton>
      </Container>
    </SafeContainer>
  );
};

export default Confirmation;
