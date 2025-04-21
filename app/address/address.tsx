import React, { useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import styled from "styled-components/native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, MapPin, ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { addAddress, updateAddress } from "../../states/address/slice";
import type { Address } from "../../states/address/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "../../components/ThemedText";
import { useUser } from "@/hooks/useUser";

type RootStackParamList = {
  AddAddress: { address?: Address } | undefined;
  Checkout: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #fafbfc;
`;

const Container = styled(ScrollView)`
  flex: 1;
`;

const Header = styled(View)`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled(ThemedText)`
  font-size: 24px;
  font-family: "SemiBold";
  color: #212529;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const SubTitle = styled(ThemedText)`
  font-size: 14px;
  font-family: "Regular";
  color: #6c757d;
  margin-top: 4px;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const FormContainer = styled(View)`
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

const FormSection = styled(View)`
  padding: 16px;
`;

const InputLabel = styled(ThemedText)`
  font-size: 14px;
  font-family: "Medium";
  color: #212529;
  margin-bottom: 8px;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const StyledInput = styled(TextInput)`
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  font-size: 16px;
  font-family: "Regular";
  color: #212529;
  border: 1px solid #e9ecef;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
  margin-bottom: 16px;
`;

const Row = styled(View)`
  flex-direction: row;
  gap: 12px;
`;

const HalfWidth = styled(View)`
  flex: 1;
`;

const SaveButton = styled(TouchableOpacity)`
  margin: 16px;
  border-radius: 16px;
  overflow: hidden;
`;

const BackButton = styled(TouchableOpacity)`
  margin-${(props) => (I18nManager.isRTL ? "left" : "right")}: 16px;
`;

const ErrorText = styled(ThemedText)`
  font-size: 12px;
  font-family: "Regular";
  color: #dc3545;
  margin-top: -12px;
  margin-bottom: 16px;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

interface FormErrors {
  [key: string]: string;
}

interface AddressScreenProps {
  route?: {
    params?: {
      address?: any; // The address to edit
    };
  };
}

const AddressScreen: React.FC<AddressScreenProps> = ({ route }) => {
  const { user } = useUser();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const editAddress = route?.params?.address;

  const [formData, setFormData] = useState({
    fullName: editAddress?.fullName || "",
    streetAddress: editAddress?.streetAddress || "",
    apartment: editAddress?.apartment || "",
    city: editAddress?.city || "",
    state: editAddress?.state || "",
    zipCode: editAddress?.zipCode || "",
    country: editAddress?.country || "",
    phone: editAddress?.phone || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "عنوان الشارع مطلوب";
    }

    if (!formData.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
    }

    if (!formData.country.trim()) {
      newErrors.country = "البلد مطلوب";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = "رقم الهاتف غير صالح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      try {
        if (editAddress) {
          dispatch(updateAddress({ ...formData, id: editAddress.id }));
        } else {
          dispatch(addAddress(formData));
        }
        navigation.goBack();
      } catch (error) {
        Alert.alert(
          "خطأ",
          "حدث خطأ أثناء حفظ العنوان. يرجى المحاولة مرة أخرى.",
          [{ text: "حسناً" }]
        );
      }
    }
  };

  return (
    <SafeContainer>
      <Container>
        <Header>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton onPress={() => navigation.goBack()}>
              {I18nManager.isRTL ? (
                <ChevronRight size={24} color="#212529" />
              ) : (
                <ChevronLeft size={24} color="#212529" />
              )}
            </BackButton>
            <View>
              <HeaderTitle>عنوان الشحن</HeaderTitle>
              <SubTitle>أدخل عنوان الشحن الخاص بك</SubTitle>
            </View>
          </View>
          <MapPin size={24} color="#212529" />
        </Header>
        <FormContainer>
          <FormSection>
            <InputLabel>الاسم الكامل</InputLabel>
            <StyledInput
              placeholder="أدخل اسمك الكامل"
              value={user?.full_name}
              editable={false}
              onChangeText={(text) => {
                setFormData({ ...formData, fullName: text });
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: "" });
                }
              }}
              placeholderTextColor="#ADB5BD"
            />
            {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}

            <InputLabel>عنوان الشارع</InputLabel>
            <StyledInput
              placeholder="أدخل عنوان الشارع"
              value={formData.streetAddress}
              onChangeText={(text) => {
                setFormData({ ...formData, streetAddress: text });
                if (errors.streetAddress) {
                  setErrors({ ...errors, streetAddress: "" });
                }
              }}
              placeholderTextColor="#ADB5BD"
            />
            {errors.streetAddress && (
              <ErrorText>{errors.streetAddress}</ErrorText>
            )}

            <InputLabel>الشقة، الجناح، الوحدة (اختياري)</InputLabel>
            <StyledInput
              placeholder="رقم الشقة أو الوحدة"
              value={formData.apartment}
              onChangeText={(text) =>
                setFormData({ ...formData, apartment: text })
              }
              placeholderTextColor="#ADB5BD"
            />

            <Row>
              <HalfWidth>
                <InputLabel>المدينة</InputLabel>
                <StyledInput
                  placeholder="المدينة"
                  defaultValue={user?.city}
                  onChangeText={(text) => {
                    setFormData({ ...formData, city: text });
                    if (errors.city) {
                      setErrors({ ...errors, city: "" });
                    }
                  }}
                  placeholderTextColor="#ADB5BD"
                />
                {errors.city && <ErrorText>{errors.city}</ErrorText>}
              </HalfWidth>
              <HalfWidth>
                <InputLabel>المنطقة</InputLabel>
                <StyledInput
                  placeholder="المنطقة"
                  defaultValue={user?.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, state: text })
                  }
                  placeholderTextColor="#ADB5BD"
                />
              </HalfWidth>
            </Row>

            <Row>
              <HalfWidth>
                <InputLabel>الرمز البريدي (اختياري)</InputLabel>
                <StyledInput
                  placeholder="الرمز البريدي"
                  value={formData.zipCode}
                  onChangeText={(text) =>
                    setFormData({ ...formData, zipCode: text })
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#ADB5BD"
                />
              </HalfWidth>
            </Row>

            <InputLabel>رقم الهاتف</InputLabel>
            <StyledInput
              placeholder="رقم الهاتف"
              value={user?.phone_number}
              editable={false}
              onChangeText={(text) => {
                setFormData({ ...formData, phone: text });
                if (errors.phone) {
                  setErrors({ ...errors, phone: "" });
                }
              }}
              keyboardType="phone-pad"
              placeholderTextColor="#ADB5BD"
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </FormSection>
        </FormContainer>
      </Container>

      <SaveButton onPress={handleSave}>
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
            style={{ color: "white", fontSize: 16, fontFamily: "SemiBold" }}
          >
            {editAddress ? "تحديث العنوان" : "حفظ العنوان"}
          </ThemedText>
          <ChevronRight
            size={20}
            color="white"
            style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
          />
        </LinearGradient>
      </SaveButton>
    </SafeContainer>
  );
};

export default AddressScreen;
