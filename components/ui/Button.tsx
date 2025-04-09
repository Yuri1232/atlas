import React, { useEffect, useState } from "react";
import {
  I18nManager,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { AnimatePresence, MotiView } from "moti";
import { useDispatch, useSelector } from "react-redux";
import AlertMessage from "../features/Alert";
import { router } from "expo-router";
import { addToCart } from "@/states/ui/cart";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import { RootState } from "@/states/store";
import { CartActions } from "@/states/user/cart";
import { useUser } from "@/hooks/useUser";
import { CartItem } from "@/app/types/cart";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/app/types/navigation";

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
const AlertWrapper = styled(MotiView)`
  position: absolute;
  bottom: 50px;
  left: 50%;
`;

interface ButtonProps {
  children: React.ReactNode;
  isfeatures?: boolean;
  quantity?: number;
  selectedData?: CartItem;
}

interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface CartState {
  items: CartItem[];
}

const Button = ({
  children,
  isfeatures,
  quantity = 0,
  selectedData: data,
}: ButtonProps) => {
  const navigation = useNavigation();
  const { user, loading } = useUser();
  const cart = useSelector(
    (state: RootState) => state.cart
  ) as unknown as CartState;
  const [allSelected, setAllSelected] = useState(false);
  const [alert, setAlert] = useState(false);
  const { checkAuth } = useAuthCheck();
  const { postCart } = useUser();
  const dispatch = useDispatch();
  const selectedData = data?.attributes;

  useEffect(() => {
    if (isfeatures) {
      setAllSelected(quantity > 0);
    } else {
      setAllSelected(quantity > 0);
    }
  }, [isfeatures, quantity]);

  const onPressHandler = async () => {
    if (!user) {
      setAlert(true);
      setTimeout(() => setAlert(false), 3000);
      return;
    }

    if (!selectedData) {
      setAlert(true);
      setTimeout(() => setAlert(false), 3000);
      return;
    }

    try {
      // First, add the item to the local UI cart state
      dispatch(addToCart(selectedData));

      // Then, send the data to the backend
      const cartUserData = {
        data: {
          customer: user.id,
          product: data?.id,
          quantity: quantity || 1,
        },
      };

      console.log("Cart User Data:", cartUserData);
      await postCart(cartUserData);

      // Navigate to the cart screen
      router.push("/modal/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAlert(true);
      setTimeout(() => setAlert(false), 3000);
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
                {!user
                  ? "Please login to add items to cart"
                  : "Please select the options"}
              </AlertMessage>
            </MotiView>
          )}
        </AnimatePresence>
      </AlertWrapper>
      <Wrapper
        style={!allSelected && { backgroundColor: Colors.light.border }}
        onPress={onPressHandler}
        disabled={!selectedData}
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
