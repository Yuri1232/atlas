import { ThemedText } from "../../components/ThemedText";
import { useSelector } from "react-redux";
import {
  ScrollView,
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
  ViewProps,
  TouchableOpacityProps,
  Alert,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Truck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import OrderSummaryItem from "../components/OrderSummaryItem";
import { RootState } from "../../states/store";
import { selectSelectedAddress } from "../../states/address/selectors";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../states/store";
import { useAddressStore } from "../states/address/address";
import { Address } from "../types/address";
import { CartItem } from "../types/cart";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CartItem as CartItemComponent } from "../components/CartItem";
import CustomAlert from "../components/CustomAlert";
import base64 from "base-64";

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #fafbfc;
`;

const Container = styled(ScrollView)`
  flex: 1;
`;

const Section = styled(View)`
  margin: 16px;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
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

interface SectionHeaderProps extends TouchableOpacityProps {
  expanded?: boolean;
}

const SectionHeader = styled(TouchableOpacity)<SectionHeaderProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: ${(props) => (props.expanded ? "1px" : "0")};
  border-bottom-color: #f1f3f5;
`;

const SectionTitle = styled(ThemedText)`
  font-size: 18px;
  font-family: "SemiBold";
  color: #212529;
`;

const SectionContent = styled(View)`
  padding: 16px;
`;

const InfoBox = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: #fafbfc;
  border-radius: 16px;
  margin-bottom: 8px;
`;

interface RTLViewProps extends ViewProps {
  isRTL?: boolean;
}

const InfoContent = styled(View)<RTLViewProps>`
  flex: 1;
  margin-${(props) => (props.isRTL ? "right" : "left")}: 12px;
`;

const InfoText = styled(ThemedText)`
  font-size: 14px;
  color: #212529;
  margin-bottom: 4px;
  font-family: "Medium";
`;

const InfoLabel = styled(ThemedText)`
  font-size: 12px;
  color: #6c757d;
`;

const ChangeButton = styled(TouchableOpacity)`
  background-color: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e9ecef;
`;

const ChangeText = styled(ThemedText)`
  color: #0066ff;
  font-size: 14px;
  font-family: "Medium";
`;

interface ShippingOptionProps extends TouchableOpacityProps {
  selected?: boolean;
}

const ShippingOption = styled(TouchableOpacity)<ShippingOptionProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => (props.selected ? "#F8F9FA" : "white")};
  border-radius: 16px;
  margin-bottom: 8px;
  border: 1px solid ${(props) => (props.selected ? "#0066FF" : "#E9ECEF")};
`;

const ShippingInfo = styled(View)`
  flex: 1;
  margin-left: 12px;
`;

interface RadioButtonProps {
  isSelected: boolean;
}

const RadioButton = styled(View)<RadioButtonProps>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${(props) => (props.isSelected ? "#0066FF" : "#DEE2E6")};
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? "#0066FF" : "white")};
`;

const RadioInner = styled(View)`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: white;
`;

const TotalSection = styled(View)`
  padding: 20px;
  background-color: white;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px -2px;
      shadow-opacity: 0.08;
      shadow-radius: 8px;
    `,
    android: `
      elevation: 8;
    `,
  })}
`;

interface PriceRowProps extends ViewProps {
  last?: boolean;
}

const PriceRow = styled(View)<PriceRowProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.last ? "16px" : "8px")};
`;

const CheckoutButton = styled(TouchableOpacity)`
  overflow: hidden;
  border-radius: 16px;
`;

const ProgressBar = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: white;
  margin: 16px;
  border-radius: 20px;
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

const ProgressStep = styled(View)<{ isActive: boolean; isCompleted: boolean }>`
  align-items: center;
  flex: 1;
`;

const ProgressDot = styled(View)<{ isActive: boolean; isCompleted: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.isCompleted ? "#0066FF" : props.isActive ? "#E7F0FF" : "#F8F9FA"};
  border: 2px solid
    ${(props) =>
      props.isCompleted ? "#0066FF" : props.isActive ? "#0066FF" : "#DEE2E6"};
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressLine = styled(View)<{ isCompleted: boolean }>`
  position: absolute;
  top: 28px;
  left: 50%;
  right: 50%;
  height: 2px;
  background-color: ${(props) => (props.isCompleted ? "#0066FF" : "#DEE2E6")};
`;

const ProgressLabel = styled(ThemedText)<{ isActive: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.isActive ? "#0066FF" : "#6C757D")};
  font-family: ${(props) => (props.isActive ? "SemiBold" : "Regular")};
`;

const CheckOut = () => {
  const [expandedSection, setExpandedSection] = useState<string>("summary");
  const cartItems = useSelector(
    (state: RootState) => state.cart.data
  ) as CartItem[];
  const selectedAddress = useSelector(selectSelectedAddress);
  const [selectedShipping, setSelectedShipping] = useState<
    "standard" | "express"
  >("standard");
  const params = useLocalSearchParams();
  const currentStep = Number(params.step) || 2;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no address is selected, redirect to address selection
    if (!selectedAddress) {
      router?.replace("/modal/address-list?fromCheckout=true&step=1");
    }
  }, [selectedAddress]);

  const handleEditAddress = () => {
    router.push({
      pathname: "/modal/address-list",
      params: { fromCheckout: "true", step: "1" },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price?.replace(/[^\d.]/g, ""));
      return acc + price * item.quantity;
    }, 0);

    const shippingCost = selectedShipping === "express" ? 25 : 0;
    const tax = subtotal * 0.15;
    const total = subtotal + shippingCost + tax;

    return { subtotal, shippingCost, tax, total };
  };

  const handleContinueToPayment = async () => {
    if (!selectedAddress) {
      Alert.alert("خطأ", "الرجاء اختيار عنوان التوصيل");
      router.push("/modal/address-list?fromCheckout=true&step=1");
      return;
    }

    try {
      setIsLoading(true);
      const { total, subtotal, tax } = calculateTotals();

      // Create HTML content for the receipt
      const htmlContent = `
        <html dir="rtl">
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Courier', monospace;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                color: #000;
                direction: rtl;
              }
              .header {
                position: relative;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px dashed #ccc;
              }
              .receipt-title {
                font-size: 48px;
                font-weight: normal;
                margin: 0;
                text-transform: lowercase;
                letter-spacing: 2px;
              }
              .logo {
                position: absolute;
                top: 0;
                left: 0;
                width: 80px;
                height: 80px;
                background: #ccc;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .logo img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
              }
              .info-section h3 {
                font-size: 14px;
                color: #000;
                margin: 0 0 10px 0;
                text-transform: uppercase;
              }
              .info-section p {
                margin: 5px 0;
                font-size: 14px;
              }
              .receipt-details {
                width: 100%;
                border-collapse: collapse;
                margin: 30px 0;
                text-align: right;
              }
              .receipt-details th {
                background-color: #f8f9fa;
                padding: 15px;
                font-size: 14px;
                font-weight: bold;
                border-bottom: 2px solid #dee2e6;
              }
              .receipt-details td {
                padding: 12px 15px;
                border-bottom: 1px solid #dee2e6;
              }
              .receipt-details tr:nth-child(even) {
                background-color: #f8f9fa;
              }
              .receipt-details tr:hover {
                background-color: #f2f2f2;
              }
              .totals {
                margin-top: 20px;
                text-align: left;
              }
              .total-box {
                display: inline-block;
                border: 2px solid #000;
                padding: 15px 25px;
                margin-top: 20px;
                background-color: #f8f9fa;
              }
              .total-box .total-label {
                font-weight: bold;
                margin-left: 20px;
              }
              .terms {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
              }
              .terms h4 {
                text-transform: uppercase;
                margin-bottom: 10px;
              }
              .terms p {
                font-size: 14px;
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="receipt-title">فاتورة</h1>
              <div class="logo">
                <img src="data:image/png;base64,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" alt="Atlas Logo">
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-section">
                <h3>المرسل</h3>
                <p>متجر أطلس</p>
                <p>شارع أطلس 123</p>
                <p>الرياض، المملكة العربية السعودية</p>
              </div>
              
              <div class="info-section">
                <h3>رقم الفاتورة</h3>
                <p>ATL-${Math.random()
                  .toString(36)
                  .substr(2, 6)
                  .toUpperCase()}</p>
                <h3>تاريخ الفاتورة</h3>
                <p>${new Date().toLocaleDateString("ar-SA")}</p>
                <h3>رقم أمر الشراء</h3>
                <p>${Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                <h3>تاريخ الاستحقاق</h3>
                <p>${new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("ar-SA")}</p>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-section">
                <h3>فاتورة إلى</h3>
                <p>${selectedAddress?.name || "اسم العميل"}</p>
                <p>${selectedAddress?.street || ""}</p>
                <p>${selectedAddress?.city || ""}, ${
        selectedAddress?.state || ""
      }</p>
                <p>${selectedAddress?.country || ""}</p>
              </div>
              
              <div class="info-section">
                <h3>الشحن إلى</h3>
                <p>${selectedAddress?.name || "اسم العميل"}</p>
                <p>${selectedAddress?.street || ""}</p>
                <p>${selectedAddress?.city || ""}, ${
        selectedAddress?.state || ""
      }</p>
                <p>${selectedAddress?.country || ""}</p>
              </div>
            </div>

            <table class="receipt-details">
              <thead>
                <tr>
                  <th>الكمية</th>
                  <th>الوصف</th>
                  <th>سعر الوحدة</th>
                  <th>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                ${cartItems
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.quantity}</td>
                    <td>${item.name}</td>
                    <td>${Number(item.price)} ريال</td>
                    <td>${Number(item.price) * Number(item.quantity)} ريال</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="totals">
              <div>المجموع الفرعي: ${subtotal.toFixed(2)} ريال</div>
              <div>ضريبة القيمة المضافة (15%): ${tax.toFixed(2)} ريال</div>
              <div class="total-box">
                <span class="total-label">المجموع الكلي</span>
                <span class="total-amount">${total.toFixed(2)} ريال</span>
              </div>
            </div>

            <div class="terms">
              <h4>الشروط والأحكام</h4>
              <p>يستحق الدفع خلال 15 يوم</p>
              <p>يرجى إصدار الشيكات باسم: متجر أطلس</p>
            </div>
          </body>
        </html>
      `;

      // Use a simple string replacement to make the HTML content URL-safe
      const safeHtml = htmlContent
        ?.replace(/&/g, "&amp;")
        ?.replace(/</g, "&lt;")
        ?.replace(/>/g, "&gt;")
        ?.replace(/"/g, "&quot;")
        ?.replace(/'/g, "&#039;");

      // Navigate to payment with receipt data
      router.push({
        pathname: "/payment/payment",
        params: {
          step: "3",
          total: total.toString(),
          subtotal: subtotal.toString(),
          tax: tax.toString(),
          shippingAddress: JSON.stringify(selectedAddress),
          orderItems: JSON.stringify(cartItems),
          receiptHtml: safeHtml,
        },
      });
    } catch (error) {
      console.error("Error preparing payment:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء تحضير عملية الدفع. الرجاء المحاولة مرة أخرى",
        [{ text: "حسناً" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, shippingCost, tax, total } = calculateTotals();

  return (
    <SafeContainer>
      <Container>
        <ProgressBar>
          <ProgressStep
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
          >
            <ProgressDot
              isActive={currentStep === 1}
              isCompleted={currentStep > 1}
            >
              {currentStep > 1 && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </ProgressDot>
            <ProgressLabel isActive={currentStep === 1}>العنوان</ProgressLabel>
          </ProgressStep>

          <ProgressLine isCompleted={currentStep > 1} />

          <ProgressStep
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
          >
            <ProgressDot
              isActive={currentStep === 2}
              isCompleted={currentStep > 2}
            >
              {currentStep > 2 && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </ProgressDot>
            <ProgressLabel isActive={currentStep === 2}>الطلب</ProgressLabel>
          </ProgressStep>

          <ProgressLine isCompleted={currentStep > 2} />

          <ProgressStep
            isActive={currentStep === 3}
            isCompleted={currentStep > 3}
          >
            <ProgressDot
              isActive={currentStep === 3}
              isCompleted={currentStep > 3}
            >
              {currentStep > 3 && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </ProgressDot>
            <ProgressLabel isActive={currentStep === 3}>الدفع</ProgressLabel>
          </ProgressStep>
        </ProgressBar>

        <Section>
          <SectionHeader
            expanded={expandedSection === "summary"}
            onPress={() => toggleSection("summary")}
          >
            <SectionTitle>ملخص الطلب</SectionTitle>
            {expandedSection === "summary" ? (
              <ChevronUp size={20} color="#212529" />
            ) : (
              <ChevronDown size={20} color="#212529" />
            )}
          </SectionHeader>
          {expandedSection === "summary" && (
            <SectionContent>
              {cartItems.map((item: CartItem) => (
                <OrderSummaryItem
                  key={item.slug}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  imageUrl={item.image?.data[0]?.attributes?.url || ""}
                  color={item.features?.color}
                  storage={item.features?.storage}
                  ram={item.features?.ram}
                />
              ))}
            </SectionContent>
          )}
        </Section>

        <Section>
          <SectionHeader
            expanded={expandedSection === "contact"}
            onPress={() => toggleSection("contact")}
          >
            <SectionTitle>معلومات التواصل</SectionTitle>
            {expandedSection === "contact" ? (
              <ChevronUp size={20} color="#212529" />
            ) : (
              <ChevronDown size={20} color="#212529" />
            )}
          </SectionHeader>
          {expandedSection === "contact" && (
            <SectionContent>
              <InfoBox>
                <Mail size={20} color="#212529" />
                <InfoContent isRTL={I18nManager.isRTL}>
                  <InfoText>البريد الإلكتروني</InfoText>
                  <InfoLabel>example@email.com</InfoLabel>
                </InfoContent>
                <ChangeButton>
                  <ChangeText>تغيير</ChangeText>
                </ChangeButton>
              </InfoBox>
            </SectionContent>
          )}
        </Section>

        <Section>
          <SectionHeader
            expanded={expandedSection === "shipping"}
            onPress={() => toggleSection("shipping")}
          >
            <SectionTitle>عنوان الشحن</SectionTitle>
            {expandedSection === "shipping" ? (
              <ChevronUp size={20} color="#212529" />
            ) : (
              <ChevronDown size={20} color="#212529" />
            )}
          </SectionHeader>
          {expandedSection === "shipping" && (
            <SectionContent>
              {selectedAddress ? (
                <InfoBox>
                  <MapPin size={20} color="#212529" />
                  <InfoContent isRTL={I18nManager.isRTL}>
                    <InfoText>{selectedAddress.name}</InfoText>
                    <InfoLabel>
                      {selectedAddress.street}, {selectedAddress.city}
                    </InfoLabel>
                    <InfoLabel>
                      {selectedAddress.state}, {selectedAddress.country}
                    </InfoLabel>
                  </InfoContent>
                  <ChangeButton onPress={handleEditAddress}>
                    <ChangeText>تغيير</ChangeText>
                  </ChangeButton>
                </InfoBox>
              ) : (
                <InfoBox>
                  <MapPin size={20} color="#212529" />
                  <InfoContent isRTL={I18nManager.isRTL}>
                    <InfoText>لم يتم تحديد عنوان</InfoText>
                    <InfoLabel>يرجى إضافة عنوان للشحن</InfoLabel>
                  </InfoContent>
                  <ChangeButton onPress={handleEditAddress}>
                    <ChangeText>إضافة</ChangeText>
                  </ChangeButton>
                </InfoBox>
              )}
            </SectionContent>
          )}
        </Section>

        <Section>
          <SectionHeader
            expanded={expandedSection === "method"}
            onPress={() => toggleSection("method")}
          >
            <SectionTitle>طريقة الشحن</SectionTitle>
            {expandedSection === "method" ? (
              <ChevronUp size={20} color="#212529" />
            ) : (
              <ChevronDown size={20} color="#212529" />
            )}
          </SectionHeader>
          {expandedSection === "method" && (
            <SectionContent>
              <ShippingOption
                selected={selectedShipping === "standard"}
                onPress={() => setSelectedShipping("standard")}
              >
                <RadioButton isSelected={selectedShipping === "standard"}>
                  {selectedShipping === "standard" && <RadioInner />}
                </RadioButton>
                <ShippingInfo>
                  <InfoText>الشحن القياسي</InfoText>
                  <InfoLabel>3-5 أيام عمل</InfoLabel>
                </ShippingInfo>
                <ThemedText
                  style={{ color: "#0066FF", fontFamily: "SemiBold" }}
                >
                  مجاناً
                </ThemedText>
              </ShippingOption>

              <ShippingOption
                selected={selectedShipping === "express"}
                onPress={() => setSelectedShipping("express")}
              >
                <RadioButton isSelected={selectedShipping === "express"}>
                  {selectedShipping === "express" && <RadioInner />}
                </RadioButton>
                <ShippingInfo>
                  <InfoText>الشحن السريع</InfoText>
                  <InfoLabel>1-2 يوم عمل</InfoLabel>
                </ShippingInfo>
                <ThemedText
                  style={{ color: "#0066FF", fontFamily: "SemiBold" }}
                >
                  25 ريال
                </ThemedText>
              </ShippingOption>
            </SectionContent>
          )}
        </Section>
      </Container>

      <TotalSection>
        <PriceRow>
          <ThemedText style={{ color: "#6C757D" }}>المجموع الفرعي</ThemedText>
          <ThemedText style={{ fontFamily: "SemiBold" }}>
            {subtotal.toFixed(2)} ريال
          </ThemedText>
        </PriceRow>
        <PriceRow>
          <ThemedText style={{ color: "#6C757D" }}>الشحن</ThemedText>
          <ThemedText style={{ fontFamily: "SemiBold" }}>
            {selectedShipping === "express" ? "25 ريال" : "مجاناً"}
          </ThemedText>
        </PriceRow>
        <PriceRow>
          <ThemedText style={{ color: "#6C757D" }}>الضريبة (15%)</ThemedText>
          <ThemedText style={{ fontFamily: "SemiBold" }}>
            {tax.toFixed(2)} ريال
          </ThemedText>
        </PriceRow>
        <PriceRow>
          <ThemedText
            style={{ fontSize: 18, color: "#212529", fontFamily: "SemiBold" }}
          >
            المجموع الكلي
          </ThemedText>
          <ThemedText
            style={{ fontSize: 18, color: "#212529", fontFamily: "Bold" }}
          >
            {total.toFixed(2)} ريال
          </ThemedText>
        </PriceRow>

        <CheckoutButton
          disabled={!selectedAddress}
          onPress={handleContinueToPayment}
        >
          <LinearGradient
            colors={isLoading ? ["#E9ECEF", "#DEE2E6"] : ["#0066FF", "#0055FF"]}
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
                color: isLoading ? "#ADB5BD" : "white",
                fontSize: 16,
                fontFamily: "SemiBold",
              }}
            >
              {isLoading ? "جاري التحميل..." : "المتابعة للدفع"}
            </ThemedText>
            <ChevronRight
              size={20}
              color={isLoading ? "#ADB5BD" : "white"}
              style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            />
          </LinearGradient>
        </CheckoutButton>
      </TotalSection>
    </SafeContainer>
  );
};

export default CheckOut;
