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
import { useUser } from "@/hooks/useUser";
import { CartItem as AppCartItem } from "@/app/types/cart";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/app/types/navigation";
import auth from "@react-native-firebase/auth";
import { cartIdAvailableSetter } from "@/states/ui";

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
  selectedData?: any; // Changed from CartItem to any to handle the attributes property
}

interface UserState {
  data: any;
  loading: boolean;
  error: string | null;
}

interface CartState {
  items: AppCartItem[];
}

interface StrapiCartItem {
  id: number;
  attributes: {
    product: {
      data: {
        id: number;
      };
    };
    customer?: {
      data: {
        attributes: {
          slug: string;
        };
      };
    };
    quantity: number;
  };
}

interface StrapiCartResponse {
  data: StrapiCartItem[];
}

interface UserCartState {
  cart: { data: StrapiCartItem[] };
  loading: boolean;
  error: string | null;
}

const Button = ({
  children,
  isfeatures,
  quantity = 0,
  selectedData: data,
}: ButtonProps) => {
  const navigation = useNavigation();
  const { user: userStrapiID, loading, postCart, getCart, getUser } = useUser();
  const cart = useSelector(
    (state: RootState) => state.cart
  ) as unknown as CartState;
  const userUID = auth().currentUser;
  const [allSelected, setAllSelected] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuth } = useAuthCheck();
  const dispatch = useDispatch();
  const selectedData = data?.attributes;
  const { cart: userCart } = useSelector(
    (state: RootState) => state.userCart
  ) as unknown as UserCartState;
  console.log("userCart", userStrapiID);

  useEffect(() => {
    if (isfeatures) {
      setAllSelected(quantity > 0);
    } else {
      setAllSelected(quantity > 0);
    }
  }, [isfeatures, quantity]);

  const showAlert = (message: string) => {
    setAlert(true);
    setTimeout(() => setAlert(false), 3000);
  };
  const onPressHandler = async () => {
    // Validate user and selected data
    if (!userUID) {
      showAlert("Please login to add items to cart");
      return;
    }

    if (!data) {
      showAlert("Please select the options");
      return;
    }

    // Prevent multiple submissions
    if (isLoading) return;
    setIsLoading(true);

    try {
      // First check if product exists in local data
      // const localProductExists =
      //   data && selectedData && data.id === selectedData.id;
      dispatch(addToCart(data));
      dispatch(cartIdAvailableSetter(false));

      // Update local UI state immediately

      // Navigate to cart screen immediately - don't wait for API calls
      router.push("/modal/cart");

      // Then handle backend operations in the background
      const cartUserData = {
        data: {
          customer: userStrapiID?.id,
          product: data?.id,
          quantity: quantity || 1,
        },
      };

      console.log("userCartasdasdasdasdasd", cartUserData);
      // Check backend in background without blocking the UI
      getCart()
        .then(() => {
          // Check if the product exists in the cart
          const productExists = userCart?.data?.some((item: StrapiCartItem) => {
            if (!item?.attributes?.product?.data?.id) return false;

            // Compare product ID and user ID
            const productId = item.attributes.product.data.id;
            const customerSlug =
              item.attributes.customer?.data?.attributes?.slug;

            return productId === data?.id && customerSlug === userUID?.uid;
          });

          // Only add to backend if product doesn't exist
          if (!productExists) {
            postCart(cartUserData)
              .then(() => {
                // Refresh cart data after adding, but don't block UI
                getCart();
                dispatch(cartIdAvailableSetter(true));
              })
              .catch((error) => {
                console.error("Error adding to cart:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error checking cart:", error);

          // If backend check fails, still try to add the item
          postCart(cartUserData).catch((error) => {
            console.error("Error adding to cart:", error);
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error in add to cart flow:", error);
      showAlert("Failed to add item to cart. Please try again.");
      setIsLoading(false);
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
                {!userUID
                  ? "Please login to add items to cart"
                  : "Please select the options"}
              </AlertMessage>
            </MotiView>
          )}
        </AnimatePresence>
      </AlertWrapper>
      <Wrapper
        style={[
          !allSelected && { backgroundColor: Colors.light.border },
          isLoading && { opacity: 0.7 },
        ]}
        onPress={onPressHandler}
        disabled={!selectedData || isLoading}
      >
        <ThemedText
          style={
            !allSelected
              ? { color: Colors.light.placeholder }
              : { color: "orange" }
          }
          type="defaultSemiBold"
        >
          {isLoading ? "Adding..." : children}
        </ThemedText>
      </Wrapper>
    </View>
  );
};

export default Button;
