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
  const { user, postUserAddress } = useUser();
  const { id } = user.data;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const editAddress = route?.params?.address;

  const [formData, setFormData] = useState({
    home_address: "",
    city: "",
    phone_number: "",
  });

  console.log(formData, id);

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.home_address.trim()) {
      newErrors.home_address = "عنوان الشارع مطلوب";
    }

    if (!formData.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "رقم الهاتف مطلوب";
    } else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone_number.trim())) {
      newErrors.phone_number = "رقم الهاتف غير صالح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // try {
      // if (!editAddress) {
      //   dispatch(updateAddress({ ...formData, id: editAddress.id }));
      // } else {
      postUserAddress({
        data: {
          city: formData.city,
          home_address: formData.home_address,
          phone_number: formData.phone_number,
          customer: id,
        },
      });
      //   }
      navigation.goBack();
      // } catch (error) {
      //   Alert.alert(
      //     "خطأ",
      //     "حدث خطأ أثناء حفظ العنوان. يرجى المحاولة مرة أخرى.",
      //     [{ text: "حسناً" }]
      //   );
      // }
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
            <InputLabel>عنوان الشارع</InputLabel>
            <StyledInput
              placeholder="أدخل عنوان الشارع"
              value={formData.home_address}
              onChangeText={(text) => {
                setFormData({ ...formData, home_address: text });
                if (errors.streetAddress) {
                  setErrors({ ...errors, home_address: "" });
                }
              }}
              placeholderTextColor="#ADB5BD"
            />
            {errors.streetAddress && (
              <ErrorText>{errors.streetAddress}</ErrorText>
            )}

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
            </Row>

            <InputLabel>رقم الهاتف</InputLabel>
            <StyledInput
              placeholder="رقم الهاتف"
              value={user?.phone_number}
              onChangeText={(text) => {
                setFormData({ ...formData, phone_number: text });
                if (errors.phone_number) {
                  setErrors({ ...errors, phone_number: "" });
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
