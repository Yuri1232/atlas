import { ThemedText } from "../../components/ThemedText";
import {
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
  ViewProps,
  TouchableOpacityProps,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import {
  CreditCard,
  ChevronRight,
  Check,
  Apple,
  Smartphone,
} from "lucide-react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import CardInput, { CardData } from "../components/CardInput";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import CustomAlert from "../components/CustomAlert";
import base64 from "base-64";

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #fafbfc;
`;

const Container = styled(ScrollView)`
  flex: 1;
  padding: 16px;
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

const PaymentMethod = styled(TouchableOpacity)<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => (props.selected ? "#F8F9FA" : "white")};
  border-bottom-width: 1px;
  border-bottom-color: #f1f3f5;
`;

const PaymentInfo = styled(View)`
  flex: 1;
  margin-${(props) => (I18nManager.isRTL ? "right" : "left")}: 12px;
`;

const PaymentTitle = styled(ThemedText)`
  font-size: 16px;
  font-family: "Medium";
  color: #212529;
  margin-bottom: 4px;
`;

const PaymentDescription = styled(ThemedText)`
  font-size: 14px;
  color: #6c757d;
`;

const RadioButton = styled(View)<{ isSelected: boolean }>`
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

const PayButton = styled(TouchableOpacity)`
  overflow: hidden;
  border-radius: 16px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const CardFormContainer = styled(View)`
  padding: 16px;
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

const Payment = () => {
  const params = useLocalSearchParams();
  const currentStep = 3; // Payment is always step 3
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showReceiptAlert, setShowReceiptAlert] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string>("");

  const handleCardChange = (data: CardData) => {
    setCardData(data);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsCardValid(isValid);
  };

  const handlePayment = async () => {
    if (selectedMethod === "card" && !isCardValid) {
      Alert.alert("خطأ", "الرجاء إدخال معلومات البطاقة بشكل صحيح");
      return;
    }

    try {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After successful payment, generate receipt
      if (params.receiptHtml) {
        try {
          // Convert the HTML entities back to their original characters
          const decodedHtml = (params.receiptHtml as string)
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");

          const { uri } = await Print.printToFileAsync({
            html: decodedHtml,
            base64: false,
          });
          setReceiptUri(uri);
          setShowReceiptAlert(true);
        } catch (error) {
          console.error("Receipt generation error:", error);
          Alert.alert(
            "خطأ",
            "تم إتمام عملية الدفع بنجاح ولكن حدث خطأ في إنشاء الفاتورة",
            [{ text: "حسناً" }]
          );
          router.push("/orders");
        }
      } else {
        // If no receipt HTML, just show success and navigate
        Alert.alert("نجاح", "تم إتمام عملية الدفع بنجاح", [
          { text: "حسناً", onPress: () => router.push("/orders") },
        ]);
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء عملية الدفع. الرجاء المحاولة مرة أخرى",
        [{ text: "حسناً" }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isPaymentEnabled = selectedMethod === "card" ? isCardValid : true;

  const handleViewReceipt = async () => {
    try {
      if (receiptUri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(receiptUri);
        }
      }
    } catch (error) {
      console.error("Error sharing receipt:", error);
    } finally {
      router.push("/orders");
    }
  };

  const handleSkipReceipt = () => {
    router.push("/orders");
  };

  return (
    <SafeContainer>
      <Container>
        <ProgressBar>
          <ProgressStep isActive={false} isCompleted={true}>
            <ProgressDot isActive={false} isCompleted={true}>
              <Ionicons name="checkmark" size={16} color="white" />
            </ProgressDot>
            <ProgressLabel isActive={false}>العنوان</ProgressLabel>
          </ProgressStep>

          <ProgressLine isCompleted={true} />

          <ProgressStep isActive={false} isCompleted={true}>
            <ProgressDot isActive={false} isCompleted={true}>
              <Ionicons name="checkmark" size={16} color="white" />
            </ProgressDot>
            <ProgressLabel isActive={false}>الطلب</ProgressLabel>
          </ProgressStep>

          <ProgressLine isCompleted={true} />

          <ProgressStep isActive={true} isCompleted={false}>
            <ProgressDot isActive={true} isCompleted={false} />
            <ProgressLabel isActive={true}>الدفع</ProgressLabel>
          </ProgressStep>
        </ProgressBar>

        <Section>
          <SectionTitle>اختر طريقة الدفع</SectionTitle>
          <PaymentMethod
            selected={selectedMethod === "card"}
            onPress={() => setSelectedMethod("card")}
          >
            <RadioButton isSelected={selectedMethod === "card"}>
              {selectedMethod === "card" && <RadioInner />}
            </RadioButton>
            <PaymentInfo>
              <PaymentTitle>بطاقة ائتمان</PaymentTitle>
              <PaymentDescription>
                Visa, Mastercard, American Express
              </PaymentDescription>
            </PaymentInfo>
            <CreditCard size={24} color="#0066FF" />
          </PaymentMethod>

          <PaymentMethod
            selected={selectedMethod === "apple"}
            onPress={() => setSelectedMethod("apple")}
          >
            <RadioButton isSelected={selectedMethod === "apple"}>
              {selectedMethod === "apple" && <RadioInner />}
            </RadioButton>
            <PaymentInfo>
              <PaymentTitle>Apple Pay</PaymentTitle>
              <PaymentDescription>
                الدفع السريع باستخدام Apple Pay
              </PaymentDescription>
            </PaymentInfo>
            <Apple size={24} color="#0066FF" />
          </PaymentMethod>

          <PaymentMethod
            selected={selectedMethod === "google"}
            onPress={() => setSelectedMethod("google")}
          >
            <RadioButton isSelected={selectedMethod === "google"}>
              {selectedMethod === "google" && <RadioInner />}
            </RadioButton>
            <PaymentInfo>
              <PaymentTitle>Google Pay</PaymentTitle>
              <PaymentDescription>
                الدفع السريع باستخدام Google Pay
              </PaymentDescription>
            </PaymentInfo>
            <Smartphone size={24} color="#0066FF" />
          </PaymentMethod>
        </Section>

        {selectedMethod === "card" && (
          <Section>
            <SectionTitle>معلومات البطاقة</SectionTitle>
            <CardFormContainer>
              <CardInput
                onCardChange={handleCardChange}
                onValidationChange={handleValidationChange}
              />
            </CardFormContainer>
          </Section>
        )}

        <PayButton
          disabled={!isPaymentEnabled || isProcessing}
          onPress={handlePayment}
        >
          <LinearGradient
            colors={
              isPaymentEnabled && !isProcessing
                ? ["#0066FF", "#0055FF"]
                : ["#E9ECEF", "#DEE2E6"]
            }
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
                color: isPaymentEnabled && !isProcessing ? "white" : "#ADB5BD",
                fontSize: 16,
                fontFamily: "SemiBold",
              }}
            >
              {isProcessing ? "جاري المعالجة..." : "إتمام الدفع"}
            </ThemedText>
            <ChevronRight
              size={20}
              color={isPaymentEnabled && !isProcessing ? "white" : "#ADB5BD"}
              style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            />
          </LinearGradient>
        </PayButton>

        <CustomAlert
          visible={showReceiptAlert}
          title="تم إتمام عملية الدفع بنجاح"
          message="هل تريد تحميل الفاتورة الآن؟"
          primaryButton={{
            text: "تحميل الفاتورة",
            onPress: handleViewReceipt,
          }}
          secondaryButton={{
            text: "تخطي",
            onPress: handleSkipReceipt,
          }}
        />
      </Container>
    </SafeContainer>
  );
};

export default Payment;
