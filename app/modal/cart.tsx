import Card from "@/components/modal/Card";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Car, Loader, ShoppingCart, Trash2, X } from "lucide-react-native";
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
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { styled } from "styled-components";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "@/states/ui/cart";
import { cartIdAvailableSetter } from "@/states/ui";
import { LinearGradient } from "react-native-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CartGetAction } from "@/states/user/cart";
import { RootState } from "@/states/store";
import { useUser } from "@/hooks/useUser";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Define interfaces for the data structures
interface ProductAttributes {
  name: string;
  price: string;
  discount_price?: string;
  discount?: number;
  slug: string;
  image?: {
    data: Array<{
      attributes: {
        url: string;
      };
    }>;
  };
  features: {
    color?: string;
    storage?: string;
    quantity?: number;
    ram?: string;
  };
  quantity: number;
}

interface CartItem {
  id: string | number;
  attributes: {
    product: {
      data: {
        attributes: ProductAttributes;
      };
    };
    quantity: number;
    customer?: {
      data: {
        attributes: {
          slug: string;
        };
      };
    };
  };
}

interface UserCartState {
  cart: {
    data: CartItem[];
  };
}

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

// Custom delete confirmation modal components
const DeleteModalOverlay = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DeleteModalContent = styled(Animated.View)`
  width: 80%;
  background-color: white;
  border-radius: 24px;
  padding: 24px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const DeleteTitle = styled(ThemedText)`
  font-size: 18px;
  font-family: "Bold";
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
`;

const DeleteMessage = styled(ThemedText)`
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
`;

const DeleteIconContainer = styled(View)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #ffeeee;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const LoadingProgressContainer = styled(View)`
  width: 100%;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  margin-top: 16px;
  overflow: hidden;
`;

const LoadingProgressBar = styled(Animated.View)`
  height: 100%;
  background-color: #ff3b30;
  border-radius: 2px;
`;

const LoadingProgressText = styled(ThemedText)`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  text-align: center;
`;

const ButtonsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const CancelButton = styled(Pressable)`
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 12px;
  flex: 1;
  margin: 0 4px;
  align-items: center;
`;

const DeleteButton = styled(Pressable)`
  padding: 12px 16px;
  background-color: #ff3b30;
  border-radius: 12px;
  flex: 1;
  margin: 0 4px;
  align-items: center;
`;

const ButtonText = styled(ThemedText)`
  font-size: 16px;
  font-family: "SemiBold";
`;

export default function Modal() {
  const { data } = useSelector((state: any) => state.cart);

  const { cart: userCart } = useSelector(
    (state: RootState) => state.userCart
  ) as unknown as UserCartState;
  const { cartIdAvailable } = useSelector((state: RootState) => state.ui);
  const [visibleItem, setVisibleItem] = useState<ProductAttributes[]>([]);
  const [sortOrder, setSortOrder] = useState<Record<string, number>>({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [waitingForCartId, setWaitingForCartId] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<
    string | number | null
  >(null);
  const [currentData, setCurrentData] = useState([]);
  const [itemToDelete, setItemToDelete] = useState<{
    productId: string | number | null;
    cartId: string | number | null;
  }>({ productId: null, cartId: null });
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;
  const dispatch = useDispatch();
  const isRTL = I18nManager.isRTL;
  const translateY = useSharedValue(0);
  const { getCart, deleteCartItem } = useUser();
  const user = auth().currentUser;

  // Animation values for delete modal
  const deleteModalOpacity = useSharedValue(0);
  const deleteModalScale = useSharedValue(0.8);
  const loadingProgress = useSharedValue(0);
  const loadingProgressValue = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
  }, []);
  const cartId = data.flatMap((item: any) => item?.carts);
  console.log("cartId", cartId);
  // Filter cart items for current user
  useEffect(() => {
    // If no user is logged in or no data is available, return empty array

    if (!user?.uid) {
      setVisibleItem([]);
      return;
    }

    // If Strapi data is loading or empty, use local cart data

    // Convert local cart data format to match Strapi format if needed
    console.log("Using local cart data:", data);
    const cartId = userCart.data.filter(
      (item: CartItem) =>
        item.attributes.customer?.data?.attributes?.slug === user.uid
    );

    const result = data
      ? data.map((item: any, index: number) => ({
          ...item.attributes,
          id: cartId[index]?.id,
          productId: item.id,

          quantity: item.quantity || 1,
        }))
      : [];
    setVisibleItem(result); // Otherwise use Strapi data filtered by current user
    setCurrentData(result);
    console.log("result", result);
    // return userCart.data.filter(
    //   (item: CartItem) =>
    //     item.attributes.customer?.data?.attributes?.s lug === user.uid
    // );
  }, [user, data, userCart, cartIdAvailable]);
  console.log("visibleItem", visibleItem);

  // Initialize sort order on first load
  // useEffect(() => {
  //   if (userCartItems.length > 0 && Object.keys(sortOrder).length === 0) {
  //     // Create a sort order mapping based on initial cart order
  //     const newSortOrder: Record<string, number> = {};
  //     userCartItems.forEach((item: CartItem, index: number) => {
  //       if (item.id) {
  //         newSortOrder[item.id.toString()] = index;
  //       }
  //     });
  //     setSortOrder(newSortOrder);
  //   }
  // }, [userCartItems, sortOrder]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (userCartItems.length > 0) {
  //       // Map and maintain consistent order
  //       const mappedItems = userCartItems.map((item: CartItem) => ({
  //         ...item.attributes.product.data.attributes,
  //         quantity: item.attributes.quantity,
  //         id: item.id,
  //         // Add sortKey property for stable sorting
  //         sortKey: sortOrder[item.id?.toString() || ""] || 999,
  //       }));

  //       // Sort by the original order
  //       const sortedItems = [...mappedItems].sort(
  //         (a, b) => a.sortKey - b.sortKey
  //       );
  //       setVisibleItem(sortedItems);
  //     } else {
  //       setVisibleItem([]);
  //     }
  //   }, 100);

  //   return () => clearTimeout(timer);
  // }, [userCartItems, sortOrder]);

  const totalPrice = useMemo(() => {
    return visibleItem?.reduce((acc: number, item: any) => {
      const price = parseFloat(item?.price?.replace(/[^\d.,]/g, "")) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [visibleItem]);

  // Polling effect for cart ID
  useEffect(() => {
    if (!waitingForCartId || retryCount >= maxRetries) return;

    const timer = setTimeout(() => {
      const newData = currentData?.find(
        (item: any) => item.productId === currentProductId
      );

      if (newData?.id) {
        setWaitingForCartId(false);
        setIsDeleting(true);
        deleteCartItem(newData.id)
          .then(() => {
            dispatch(removeFromCart(itemToDelete?.productId));
            closeDeleteModal();
            setRetryCount(0);
          })
          .catch((error) => {
            console.error("Error during deletion:", error);
            setRetryCount((prev) => prev + 1);
          })
          .finally(() => {
            setIsDeleting(false);
          });
      } else {
        setRetryCount((prev) => prev + 1);
        console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [waitingForCartId, retryCount, currentData, currentProductId]);

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!itemToDelete?.productId) return;

    try {
      setIsDeleting(true);

      const newData = currentData?.find(
        (item: any) => item.productId === currentProductId
      );
      console.log("newData", newData);

      if (newData?.id) {
        await deleteCartItem(newData.id);
        dispatch(removeFromCart(itemToDelete.productId));
        closeDeleteModal();
        setRetryCount(0);
      } else {
        setWaitingForCartId(true);
        setRetryCount(0);
        console.log("Starting polling for cart ID...");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setIsDeleting(false);
    }
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!deleteModalVisible) {
      setRetryCount(0);
      setWaitingForCartId(false);
      setIsDeleting(false);
    }
  }, [deleteModalVisible]);

  // Show delete confirmation modal
  const onPressHandler = useCallback(
    (productId: string | number, cartItemId: string | number) => {
      setItemToDelete({ productId: productId, cartId: cartItemId });
      setCurrentProductId(productId);
      setDeleteModalVisible(true);

      // Animate modal appearance
      deleteModalOpacity.value = withTiming(1, { duration: 250 });
      deleteModalScale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
    },
    []
  );

  // Close delete modal
  const closeDeleteModal = () => {
    // Animate modal disappearance
    deleteModalOpacity.value = withTiming(0, { duration: 200 });
    deleteModalScale.value = withTiming(0.8, { duration: 200 });

    // Set state after animation
    setTimeout(() => {
      setDeleteModalVisible(false);
      setItemToDelete({ productId: null, cartId: null });
    }, 200);
  };

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const deleteModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: deleteModalOpacity.value,
    };
  });

  const deleteModalContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: deleteModalScale.value }],
    };
  });

  // Update loading progress based on retry attempts
  useEffect(() => {
    if (waitingForCartId) {
      // Calculate progress based on retry count
      const progress = (retryCount / maxRetries) * 100;
      loadingProgressValue.value = withTiming(progress / 100, {
        duration: 500,
      });
    } else if (isDeleting) {
      // When deleting, show full progress
      loadingProgressValue.value = withTiming(1, { duration: 500 });
    } else {
      loadingProgressValue.value = withTiming(0);
    }
  }, [retryCount, waitingForCartId, isDeleting]);

  const loadingProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${loadingProgressValue.value * 100}%`,
    };
  });

  return (
    <>
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

          {visibleItem.length === 0 ? (
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
              renderItem={({ item, index }) => {
                console.log("xxxx", item.quantity);
                return (
                  <Animated.View
                    layout={Layout}
                    entering={FadeIn.delay(index * 100).springify()}
                    exiting={FadeOut.springify()}
                  >
                    <Card
                      id={index}
                      cartId={item.id}
                      index={item.slug}
                      name={item.name}
                      price={item.price}
                      discount_price={item.discount_price}
                      discount={item.discount}
                      imageUrl={item.image?.data[0]?.attributes?.url}
                      color={item.features?.color}
                      storage={item.features?.storage}
                      quantity={item.features?.quantity}
                      count={item.quantity}
                      ram={item.features?.ram}
                      onPressHandler={() => {
                        setCurrentProductId(item.productId);
                        onPressHandler(item.productId, item.id);
                      }}
                    />
                    <Line />
                  </Animated.View>
                );
              }}
            />
          )}

          <ButtonContainer>
            <Button>
              <ThemedText style={{ fontSize: 16, fontFamily: "SemiBold" }}>
                {isRTL ? "إتمام الشراء" : "Check out"} - ${totalPrice}
              </ThemedText>
            </Button>
          </ButtonContainer>

          {/* Delete confirmation modal */}
          {deleteModalVisible && (
            <DeleteModalOverlay style={deleteModalAnimatedStyle}>
              <DeleteModalContent style={deleteModalContentAnimatedStyle}>
                <DeleteIconContainer>
                  {isDeleting || waitingForCartId ? (
                    <Trash2 size={28} color="#FF3B30" />
                  ) : (
                    <Trash2 size={28} color="#FF3B30" />
                  )}
                </DeleteIconContainer>
                <DeleteTitle>
                  {isRTL ? "إزالة العنصر" : "Remove Item"}
                </DeleteTitle>
                <DeleteMessage>
                  {waitingForCartId
                    ? isRTL
                      ? "جاري التحقق من سلة التسوق..."
                      : "Verifying cart..."
                    : isRTL
                    ? "هل أنت متأكد أنك تريد إزالة هذا العنصر من سلة التسوق الخاصة بك؟"
                    : "Are you sure you want to remove this item from your cart?"}
                </DeleteMessage>
                {(isDeleting || waitingForCartId) && (
                  <>
                    <LoadingProgressContainer>
                      <LoadingProgressBar style={loadingProgressStyle} />
                    </LoadingProgressContainer>
                    <LoadingProgressText>
                      {waitingForCartId
                        ? isRTL
                          ? `جاري التحقق... (${retryCount + 1}/${maxRetries})`
                          : `Verifying... (${retryCount + 1}/${maxRetries})`
                        : isRTL
                        ? "جاري الحذف..."
                        : "Deleting..."}
                    </LoadingProgressText>
                  </>
                )}
                <ButtonsContainer
                  style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  <CancelButton
                    onPress={closeDeleteModal}
                    disabled={isDeleting || waitingForCartId}
                  >
                    <ButtonText style={{ color: "#666" }}>
                      {isRTL ? "إلغاء" : "Cancel"}
                    </ButtonText>
                  </CancelButton>
                  <DeleteButton
                    onPress={handleDelete}
                    disabled={isDeleting || waitingForCartId}
                  >
                    <ButtonText style={{ color: "white" }}>
                      {isRTL ? "إزالة" : "Remove"}
                    </ButtonText>
                  </DeleteButton>
                </ButtonsContainer>
              </DeleteModalContent>
            </DeleteModalOverlay>
          )}
        </ModalContent>
      </ModalContainer>
    </>
  );
}
