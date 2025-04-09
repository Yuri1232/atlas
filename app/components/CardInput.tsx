import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";

import { I18nManager } from "react-native";
import { CreditCard } from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";

const Container = styled(View)`
  margin-bottom: 16px;
`;

const InputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 12px 16px;
  border-width: 1px;
  border-color: #e9ecef;
`;

const Input = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  color: #212529;
  font-family: "Regular";
  text-align: ${I18nManager.isRTL ? "right" : "left"};
  padding: 0;
`;

const ErrorText = styled(ThemedText)`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  margin-${I18nManager.isRTL ? "right" : "left"}: 4px;
`;

const Label = styled(ThemedText)`
  font-size: 14px;
  color: #495057;
  margin-bottom: 8px;
  margin-${I18nManager.isRTL ? "right" : "left"}: 4px;
`;

const Row = styled(View)`
  flex-direction: row;
  gap: 12px;
`;

const CardIcon = styled(View)`
  margin-${I18nManager.isRTL ? "left" : "right"}: 8px;
`;

interface CardInputProps {
  onCardChange: (cardData: CardData) => void;
  onValidationChange: (isValid: boolean) => void;
}

export interface CardData {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

const CardInput: React.FC<CardInputProps> = ({
  onCardChange,
  onValidationChange,
}) => {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const [errors, setErrors] = useState<Partial<CardData>>({});

  const validateCardNumber = (number: string) => {
    // Remove spaces and non-digit characters
    const cleanNumber = number.replace(/\D/g, "");

    // Check if it's a valid card number (Luhn algorithm)
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost side
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateExpiry = (expiry: string) => {
    if (!expiry) return false;

    const [month, year] = expiry.split("/");
    if (!month || !year) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return false;

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  const validateCVC = (cvc: string) => {
    return cvc.length >= 3 && cvc.length <= 4 && /^\d+$/.test(cvc);
  };

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const formatCardNumber = (text: string) => {
    const cleanText = text.replace(/\D/g, "");
    const groups = cleanText.match(/.{1,4}/g) || [];
    return groups.join(" ");
  };

  const formatExpiry = (text: string) => {
    const cleanText = text.replace(/\D/g, "");
    if (cleanText.length >= 2) {
      return `${cleanText.substring(0, 2)}/${cleanText.substring(2, 4)}`;
    }
    return cleanText;
  };

  const handleChange = (field: keyof CardData, value: string) => {
    let formattedValue = value;

    if (field === "number") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (field === "cvc") {
      formattedValue = value.replace(/\D/g, "");
    }

    const newCardData = { ...cardData, [field]: formattedValue };
    setCardData(newCardData);

    // Validate the field
    let newErrors = { ...errors };
    let isValid = true;

    if (field === "number") {
      if (!validateCardNumber(formattedValue.replace(/\s/g, ""))) {
        newErrors.number = "رقم البطاقة غير صالح";
        isValid = false;
      } else {
        delete newErrors.number;
      }
    } else if (field === "expiry") {
      if (!validateExpiry(formattedValue)) {
        newErrors.expiry = "تاريخ الانتهاء غير صالح";
        isValid = false;
      } else {
        delete newErrors.expiry;
      }
    } else if (field === "cvc") {
      if (!validateCVC(formattedValue)) {
        newErrors.cvc = "رمز CVC غير صالح";
        isValid = false;
      } else {
        delete newErrors.cvc;
      }
    } else if (field === "name") {
      if (!validateName(formattedValue)) {
        newErrors.name = "الرجاء إدخال الاسم";
        isValid = false;
      } else {
        delete newErrors.name;
      }
    }

    setErrors(newErrors);

    // Check if all fields are valid
    const allValid =
      validateCardNumber(newCardData.number.replace(/\s/g, "")) &&
      validateExpiry(newCardData.expiry) &&
      validateCVC(newCardData.cvc) &&
      validateName(newCardData.name);

    onValidationChange(allValid);
    onCardChange(newCardData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Container>
          <Label>اسم حامل البطاقة</Label>
          <InputContainer>
            <Input
              placeholder="الاسم على البطاقة"
              value={cardData.name}
              onChangeText={(text) => handleChange("name", text)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </InputContainer>
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </Container>

        <Container>
          <Label>رقم البطاقة</Label>
          <InputContainer>
            <Input
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChangeText={(text) => handleChange("number", text)}
              keyboardType="numeric"
              maxLength={19}
              returnKeyType="next"
            />
            <CardIcon>
              <CreditCard size={20} color="#6c757d" />
            </CardIcon>
          </InputContainer>
          {errors.number && <ErrorText>{errors.number}</ErrorText>}
        </Container>

        <Row>
          <Container style={{ flex: 1 }}>
            <Label>تاريخ الانتهاء</Label>
            <InputContainer>
              <Input
                placeholder="MM/YY"
                value={cardData.expiry}
                onChangeText={(text) => handleChange("expiry", text)}
                keyboardType="numeric"
                maxLength={5}
                returnKeyType="next"
              />
            </InputContainer>
            {errors.expiry && <ErrorText>{errors.expiry}</ErrorText>}
          </Container>

          <Container style={{ flex: 1 }}>
            <Label>CVC</Label>
            <InputContainer>
              <Input
                placeholder="123"
                value={cardData.cvc}
                onChangeText={(text) => handleChange("cvc", text)}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                returnKeyType="done"
              />
            </InputContainer>
            {errors.cvc && <ErrorText>{errors.cvc}</ErrorText>}
          </Container>
        </Row>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CardInput;
