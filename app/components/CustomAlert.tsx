import React from "react";
import { Modal, View, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

const AlertBox = styled(View)<{ type: "success" | "error" }>`
  width: 100%;
  max-width: 320px;
  background-color: white;
  border-radius: 24px;
  padding: 24px;
  align-items: center;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 4px;
      shadow-opacity: 0.15;
      shadow-radius: 12px;
    `,
    android: `
      elevation: 8;
    `,
  })}
`;

const IconContainer = styled(View)<{ type: "success" | "error" }>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  background-color: ${(props) =>
    props.type === "success" ? "#4BB543" : "#FF3B30"};
`;

const Title = styled(ThemedText)<{ type: "success" | "error" }>`
  font-size: 20px;
  color: ${(props) => (props.type === "success" ? "#4BB543" : "#FF3B30")};
  font-family: "SemiBold";
  margin-bottom: 16px;
  text-align: center;
`;

const Message = styled(ThemedText)`
  font-size: 16px;
  color: #495057;
  text-align: center;
  margin-bottom: 24px;
  line-height: 24px;
`;

const Button = styled(TouchableOpacity)`
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
`;

const ButtonContent = styled(View)`
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(ThemedText)`
  font-size: 16px;
  font-family: "SemiBold";
  color: white;
`;

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <ModalContainer>
        <AlertBox type={type}>
          <IconContainer type={type}>
            <Ionicons
              name={type === "success" ? "checkmark" : "close"}
              size={30}
              color="white"
            />
          </IconContainer>
          <Title type={type}>{title}</Title>
          <Message>{message}</Message>
          <Button onPress={onClose}>
            <LinearGradient
              colors={
                type === "success"
                  ? ["#4BB543", "#45A33D"]
                  : ["#FF3B30", "#E6352B"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: "100%" }}
            >
              <ButtonContent>
                <ButtonText>حسناً</ButtonText>
              </ButtonContent>
            </LinearGradient>
          </Button>
        </AlertBox>
      </ModalContainer>
    </Modal>
  );
};

export default CustomAlert;
