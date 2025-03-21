import React, { useEffect, useState } from "react";
import { I18nManager, TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import { AnimatePresence, MotiView, ScrollView } from "moti";
import { useSelector } from "react-redux";
import AlertMessage from "../features/Alert";

const Wrapper = styled(TouchableOpacity)`
  background-color: ${Colors.dark.blue};
  padding: 10px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  position: absolute;
  bottom: 20px;
  left: 15px;
  right: 15px;
`;

const Button = ({ children }) => {
  const { color, ram, storage } = useSelector((state) => state.ui);
  const [allSelected, setAllSelected] = useState(false);
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    if (color && ram && storage) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [color, ram, storage]);

  const onPressHandler = () => {
    if (!allSelected) {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  return (
    <View
      style={[
        {
          position: "relative",
        },
      ]}
    >
      <AlertWrapper
        style={{
          transform: [
            { translateX: I18nManager.isRTL ? "50%" : "50%" },
            { translateY: "-50%" },
          ],
        }}
      >
        <AnimatePresence>
          {alert && (
            <MotiView
              from={{ opacity: 0, translateY: "100%" }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: "100%" }}
              transition={{ type: "timing", duration: 500 }}
            >
              <AlertMessage style={{ backgroundColor: Colors.light.lightRed }}>
                Place select the options
              </AlertMessage>
            </MotiView>
          )}
        </AnimatePresence>
      </AlertWrapper>
      <Wrapper
        style={!allSelected && { backgroundColor: Colors.light.border }}
        onPress={() => {
          onPressHandler();
        }}
      >
        <ThemedText
          style={
            !allSelected
              ? { color: Colors.light.placeholder }
              : { color: "orange" }
          }
          type="defaultSemiBold"
        >
          {children}
        </ThemedText>
      </Wrapper>
    </View>
  );
};

export default Button;

const AlertWrapper = styled(MotiView)`
  position: absolute;
  bottom: 50px;
  left: 50%;
`;
