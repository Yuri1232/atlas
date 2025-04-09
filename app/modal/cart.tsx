import Card from "@/components/modal/Card";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Car, Loader, ShoppingCart, X } from "lucide-react-native";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  I18nManager,
  Image,
  Pressable,
  StyleSheet,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInDown,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { styled } from "styled-components";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "@/states/ui/cart";
import { LinearGradient } from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CartActions } from "@/states/user/cart";

const { height } = Dimensions.get("window");

const ModalContainer = styled(Animated.View)`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(Animated.View)`
  width: 100%;
  height: 90%;
  background-color: white;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  padding: 24px;
  position: relative;
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const HeaderTitle = styled(ThemedText)`
  font-size: 20px;
  font-family: "Bold";
  color: #1a1a1a;
  line-height: 26px;
`;

const CloseButton = styled(Pressable)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
`;

const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: #f5f5f5;
  margin: 16px 0;
`;

const EmptyCartContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const EmptyCartImage = styled(Image)`
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
`;

const EmptyCartText = styled(ThemedText)`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 16px;
`;

const EmptyCartSubtext = styled(ThemedText)`
  font-size: 14px;
  color: #999;
  text-align: center;
`;

const TotalContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 16px;
`;

const TotalLabel = styled(ThemedText)`
  font-size: 14px;
  color: #666;
`;

const TotalAmount = styled(ThemedText)`
  font-size: 20px;
  font-family: "Bold";
  color: #1a1a1a;
`;

const ButtonContainer = styled(View)`
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 50%;
  right: 0;
  padding: 24px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #f5f5f5;
`;

export default function Modal() {
  const { data } = useSelector((state) => state.cart);
  const [visibleItem, setVisibleItem] = useState([]);
  const dispatch = useDispatch();
  const isRTL = I18nManager.isRTL;
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItem([...data].reverse());
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  const totalPrice = useMemo(() => {
    return data?.reduce((acc, item) => {
      const price = parseFloat(item.price?.replace(/[^\d.,]/g, "")) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [data]);

  const onPressHandler = useCallback(
    (id) => {
      dispatch(removeFromCart(id));
    },
    [data, dispatch]
  );

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <ModalContainer>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => (translateY.value = withTiming(height))}
      />

      <ModalContent style={modalStyle}>
        <Header>
          <HeaderTitle>
            {isRTL ? "عربة التسوق الخاصة بك" : "Your cart"}
          </HeaderTitle>
          <Link href="../" asChild>
            <CloseButton>
              <X size={20} color="#666" />
            </CloseButton>
          </Link>
        </Header>

        {data?.length === 0 ? (
          <EmptyCartContainer>
            <EmptyCartImage
              source={require("@/assets/images/empty-cart.png")}
            />
            <EmptyCartText>
              {isRTL ? "عربة التسوق فارغة" : "Your cart is empty"}
            </EmptyCartText>
            <EmptyCartSubtext>
              {isRTL
                ? "أضف بعض المنتجات إلى سلة التسوق الخاصة بك"
                : "Add some products to your cart"}
            </EmptyCartSubtext>
          </EmptyCartContainer>
        ) : visibleItem.length === 0 ? (
          <Loader style={{ margin: "auto" }} />
        ) : (
          <FlatList
            data={visibleItem}
            keyExtractor={(item) => item.slug}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animated.View
                layout={Layout}
                entering={FadeIn.delay(index * 100).springify()}
                exiting={FadeOut.springify()}
              >
                <Card
                  id={index}
                  index={item.slug}
                  name={item.name}
                  price={item.price}
                  discount_price={item.discount_price}
                  discount={item.discount}
                  imageUrl={item.image?.data[0]?.attributes?.url}
                  color={item.features?.color}
                  storage={item.features.storage}
                  quantity={item.features.quantity}
                  count={item.quantity}
                  ram={item.features.ram}
                  onPressHandler={onPressHandler}
                />
                <Line />
              </Animated.View>
            )}
          />
        )}

        <ButtonContainer>
          <Button>
            <ThemedText style={{ fontSize: 16, fontFamily: "SemiBold" }}>
              {isRTL ? "إتمام الشراء" : "Check out"} - ${totalPrice}
            </ThemedText>
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
}
