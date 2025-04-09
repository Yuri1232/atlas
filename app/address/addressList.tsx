import React from "react";
import {
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
  Alert,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin,
  Plus,
  ChevronRight,
  Check,
  ChevronLeft,
  Trash2,
  Edit2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddress, setSelectedAddress } from "../../states/address/slice";
import {
  selectAddresses,
  selectSelectedAddressId,
} from "../../states/address/selectors";
import type { Address } from "../../states/address/types";
import { router } from "expo-router";

interface AddressListProps {
  fromCheckout?: boolean;
}

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #fafbfc;
`;

const Header = styled(View)`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled(Text)`
  font-size: 24px;
  font-family: "SemiBold";
  color: #212529;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const SubTitle = styled(Text)`
  font-size: 14px;
  font-family: "Regular";
  color: #6c757d;
  margin-top: 4px;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const AddressCard = styled(TouchableOpacity)<{ isSelected?: boolean }>`
  margin: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 20px;
  border: 2px solid ${(props) => (props.isSelected ? "#0066FF" : "transparent")};
  flex-direction: row;
  align-items: flex-start;
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

const AddressInfo = styled(View)`
  flex: 1;
  margin-${(props) => (I18nManager.isRTL ? "right" : "left")}: 12px;
`;

const AddressName = styled(Text)`
  font-size: 16px;
  font-family: "SemiBold";
  color: #212529;
  margin-bottom: 4px;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const AddressText = styled(Text)`
  font-size: 14px;
  font-family: "Regular";
  color: #6c757d;
  text-align: ${(props) => (I18nManager.isRTL ? "right" : "left")};
`;

const AddButton = styled(TouchableOpacity)`
  margin: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 20px;
  border: 2px dashed #dee2e6;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ContinueButton = styled(TouchableOpacity)`
  margin: 16px;
  border-radius: 16px;
  overflow: hidden;
`;

const DeleteButton = styled(TouchableOpacity)`
  position: absolute;
  top: 16px;
  ${(props) => (I18nManager.isRTL ? "left" : "right")}: 16px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #fee2e2;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled(TouchableOpacity)`
  margin-${(props) => (I18nManager.isRTL ? "left" : "right")}: 16px;
`;

const EmptyState = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const EmptyStateText = styled(Text)`
  font-size: 16px;
  font-family: "Medium";
  color: #6c757d;
  text-align: center;
  margin-top: 16px;
`;

const StyledText = styled(Text)`
  font-size: 14px;
  color: #333;
  ${Platform.select({
    ios: `font-family: "System"`,
    android: `font-family: "Roboto"`,
  })}
`;

const EditButton = styled(TouchableOpacity)`
  position: absolute;
  top: 16px;
  ${(props) => (I18nManager.isRTL ? "right" : "left")}: 16px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #e7f1ff;
  justify-content: center;
  align-items: center;
`;

const AddressList: React.FC<AddressListProps> = ({ fromCheckout }) => {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const selectedAddressId = useSelector(selectSelectedAddressId);

  const handleAddAddress = () => {
    router.push({
      pathname: "/modal/add-address",
    });
  };

  const handleEditAddress = (address: Address) => {
    router.push({
      pathname: "/modal/add-address",
      params: { address: JSON.stringify(address) },
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      "حذف العنوان",
      "هل أنت متأكد من حذف هذا العنوان؟",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "حذف",
          onPress: () => {
            dispatch(deleteAddress(addressId));
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleBack = () => {
    if (fromCheckout) {
      router.back();
    } else {
      router.back();
    }
  };

  if (addresses.length === 0) {
    return (
      <SafeContainer>
        <Header>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackButton onPress={handleBack}>
              {I18nManager.isRTL ? (
                <ChevronRight size={24} color="#212529" />
              ) : (
                <ChevronLeft size={24} color="#212529" />
              )}
            </BackButton>
            <View>
              <HeaderTitle>عنوان الشحن</HeaderTitle>
              <SubTitle>أضف عنوان الشحن الخاص بك</SubTitle>
            </View>
          </View>
          <MapPin size={24} color="#212529" />
        </Header>

        <EmptyState>
          <MapPin size={48} color="#ADB5BD" />
          <EmptyStateText>لم تقم بإضافة أي عنوان للشحن بعد</EmptyStateText>
        </EmptyState>

        <AddButton onPress={handleAddAddress}>
          <Plus size={20} color="#0066FF" />
          <StyledText
            style={{ color: "#0066FF", fontSize: 16, fontFamily: "Medium" }}
          >
            إضافة عنوان جديد
          </StyledText>
        </AddButton>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BackButton onPress={handleBack}>
            {I18nManager.isRTL ? (
              <ChevronRight size={24} color="#212529" />
            ) : (
              <ChevronLeft size={24} color="#212529" />
            )}
          </BackButton>
          <View>
            <HeaderTitle>عنوان الشحن</HeaderTitle>
            <SubTitle>حدد عنوان الشحن الخاص بك</SubTitle>
          </View>
        </View>
        <MapPin size={24} color="#212529" />
      </Header>

      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          isSelected={selectedAddressId === address.id}
          onPress={() => dispatch(setSelectedAddress(address.id))}
        >
          <MapPin
            size={20}
            color={selectedAddressId === address.id ? "#0066FF" : "#6C757D"}
          />
          <AddressInfo>
            <AddressName>{address.name}</AddressName>
            <AddressText>
              {address.street}, {address.city}
            </AddressText>
            <AddressText>
              {address.state}, {address.country}
            </AddressText>
          </AddressInfo>
          {selectedAddressId === address.id && (
            <Check size={20} color="#0066FF" />
          )}
          <EditButton onPress={() => handleEditAddress(address)}>
            <Edit2 size={16} color="#0066FF" />
          </EditButton>
          <DeleteButton onPress={() => handleDeleteAddress(address.id)}>
            <Trash2 size={16} color="#FF3B30" />
          </DeleteButton>
        </AddressCard>
      ))}

      <AddButton onPress={handleAddAddress}>
        <Plus size={20} color="#0066FF" />
        <StyledText
          style={{ color: "#0066FF", fontSize: 16, fontFamily: "Medium" }}
        >
          إضافة عنوان جديد
        </StyledText>
      </AddButton>

      {fromCheckout && (
        <ContinueButton
          onPress={() => router.push("/checkOut/checkOut")}
          disabled={!selectedAddressId}
        >
          <LinearGradient
            colors={
              selectedAddressId
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
            <StyledText
              style={{
                color: selectedAddressId ? "white" : "#ADB5BD",
                fontSize: 16,
                fontFamily: "SemiBold",
              }}
            >
              تأكيد العنوان
            </StyledText>
            <ChevronRight
              size={20}
              color={selectedAddressId ? "white" : "#ADB5BD"}
              style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
            />
          </LinearGradient>
        </ContinueButton>
      )}
    </SafeContainer>
  );
};

export default AddressList;
