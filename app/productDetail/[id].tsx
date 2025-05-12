import { Collapsible } from "@/components/Collapsible";
import Color from "@/components/features/Color";
import Quantity from "@/components/features/Quantiy";
import VolumeStorage from "@/components/features/ValumeStorage";
import VolumeRam from "@/components/features/VolumeRam";
import globalStyles from "@/components/globalStyles";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import { PriceHandler } from "@/components/ui/Card";
import CustomHeader from "@/components/ui/CustomHeader";
import Loader from "@/components/ui/Loader";
import { Colors } from "@/constants/Colors";
import { productDetailAction } from "@/states/prodcutDetail/productDetail";
import { HeaderTitileSetter, ramSetter } from "@/states/ui";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  I18nManager,
  Image,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Swiper from "react-native-swiper";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Wrapper = styled(View)`
  height: 380px;
  margin-top: 0;
  background-color: ${Colors.dark.blue}05;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  overflow: hidden;
`;

const Slide = styled(View)`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

const ContentContainer = styled(ScrollView)`
  background-color: #ffffff;
  flex: 1;
`;

const TextWrapper = styled(Animated.View)`
  padding: 20px 16px;
  margin: -30px 16px 0;
  border-radius: 20px;
  background-color: white;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
`;

const Line = styled(View)`
  height: 1px;
  background-color: ${Colors.light.lightGray}50;
  margin: 20px 16px;
`;

const QuanWrapper = styled(View)`
  background-color: ${Colors.light.blue}08;
  align-self: flex-start;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid ${Colors.light.blue}15;
`;

const Title = styled(ThemedText)`
  font-size: 20px;
  font-family: "SemiBold";
  margin-bottom: 12px;
  color: black;
  line-height: 28px;
  letter-spacing: -0.2px;
`;

const PriceWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const OldPrice = styled(ThemedText)`
  color: ${Colors.light.lightRed};
  font-size: 15px;
  font-family: "Regular";
  text-decoration-line: line-through;
  opacity: 0.7;
`;

const NewPrice = styled(ThemedText)`
  color: ${Colors.dark.blue};
  font-size: 22px;
  font-family: "SemiBold";
  letter-spacing: -0.3px;
  line-height: 28px;
`;

const SectionTitle = styled(ThemedText)`
  font-size: 18px;
  font-family: "SemiBold";
  color: black;
  margin: 0 16px 16px;
`;

const BottomContainer = styled(View)`
  padding: 16px 20px;
  padding-bottom: 32px;
  background-color: white;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  elevation: 12;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.08;
  shadow-radius: 12px;
`;

const ProductDetail = () => {
  const { pData, pStatus } = useSelector((state) => state.products);
  const { color, ram, storage } = useSelector((state) => state.ui);
  const [stream, setStream] = useState([]);
  const [firstLoader, setFirstLoader] = useState(false);
  const [selectedDataAnimate, setSelectedDataAnimate] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [baseName, setBaseName] = useState("");
  const [avail, setAvai] = useState([]);
  const [availStorage, setAvailStorage] = useState([]);
  const [allRam, setAllRam] = useState([]);
  const [allColor, setAllColor] = useState([]);
  const [allStorage, setAllStorage] = useState([]);
  const [availQuality, setAvailQuality] = useState();
  const [availQuantity, setAvailQuantity] = useState();
  const [defaultStorage, setDefaultStorage] = useState({});
  const [selectedBaseRam, setSelectedBaseRam] = useState({});
  const [image, setImage] = useState([]);
  const param = useLocalSearchParams();
  const isRTL = I18nManager.isRTL;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isTimeoutDone, setIsTimeoutDone] = useState(false);

  // Shared values for fade-in and fade-out effects
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(200);
  const translateYUp = useSharedValue(500);
  const duration = 1000;

  // Animated styles for title and price
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  console.log(ram, color, storage);

  const priceAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const discountPriceStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeoutDone(true); // Set the value to true after 1 second
    }, 1500);
    const timer2 = setTimeout(() => {
      setFirstLoader(true); // Set the value to true after 1 second
    }, 500);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => {
      clearTimeout(timer), clearImmediate(timer2);
    };
  }, []);

  function normalizeName(name) {
    return name.trim().replace(/\s+/g, " "); // Remove extra spaces
  }

  function matchBaseProductName(input, baseProductName) {
    const normalizedInput = normalizeName(input);
    const normalizedBaseName = normalizeName(baseProductName);
    const escapedName = normalizedBaseName.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    );
    const pattern = new RegExp(`^${escapedName}(?:\\s|$)`, "i");
    return pattern.test(normalizedInput);
  }

  useEffect(() => {
    if (pStatus === "succeeded" && pData?.data?.length > 0) {
      const selectedProduct = pData.data.find(
        (product) => product.attributes.slug === param.id
      );
      setDefaultStorage(selectedProduct?.attributes?.features);

      if (!selectedProduct) return;

      const baseProductName = selectedProduct.attributes.name
        .split(" ")
        .slice(0, 4)
        .join(" ");

      setBaseName(baseProductName);

      const filteredProducts = pData.data.filter((product) => {
        return matchBaseProductName(
          product.attributes.name?.toLowerCase(),
          baseProductName?.toLowerCase()
        );
      });

      setStream(filteredProducts);
    }
  }, [pStatus, pData, param.id]);

  useEffect(() => {
    if (stream) {
      const image = stream.map((item) => item.attributes.image.data);
      const imageURL = image.reduce((acc, group) => {
        return acc.concat(group.map((item) => item.attributes.url));
      }, []);
      setImage(imageURL);

      const color = stream.map((item) => item.attributes.features?.color);
      const ram = stream.map((item) => item.attributes.features?.ram);
      const storage = stream.map((item) => item.attributes.features?.storage);
      setAllColor(color);
      setAllRam(ram);
      setAllStorage(storage);
    }
  }, [stream]);

  const filterItems = (stream, filters) => {
    const avail = stream.filter((item) =>
      Object.entries(filters).every(
        ([key, value]) => !value || item?.attributes?.features[key] === value
      )
    );
    console.log("avail", avail);

    setAvailStorage([
      ...new Set(avail.map((item) => item?.attributes.features?.storage)),
    ]);
    setAvailQuality([
      ...new Set(avail.map((item) => item?.attributes.features?.quality)),
    ]);
    setAvailQuantity(
      avail.reduce(
        (sum, item) => sum + Number(item.attributes.features?.quantity),
        0
      )
    );
    return avail;
  };

  console.log("selected", selectedData);
  useEffect(() => {
    if (stream) {
      const baseData = stream.map((item) => item?.attributes);
      console.log("baseData", baseData);
      if (baseData) {
        const selected = filterItems(stream, { color, ram, storage });
        if (color && ram && storage) {
          setSelectedDataAnimate(selected?.[0]);
        } else {
          setSelectedDataAnimate(baseData?.[0]);
        }
      }
      navigation.setOptions({ title: baseName });
    }
  }, [color, stream, ram, storage]);

  useEffect(() => {
    if (stream) {
      const baseData = stream.map((item) => item?.attributes);
      if (baseData) {
        const selected = filterItems(stream, { color, ram });
        if (color && ram) {
          setSelectedBaseRam(
            selected?.map((item) => item?.attributes.features?.storage)
          );
        }
      }
    }
  }, [color, stream, ram]);

  useEffect(() => {
    if (!selectedDataAnimate) return;
    // Trigger fade-out effect when the title or price is about to change
    opacity.value = withTiming(0, { duration: 0 });
    translateY.value = withTiming(200, { duration: 0 });

    // Wait for the fade-out to finish, then fade-in with the new values
    setTimeout(() => {
      setSelectedData(selectedDataAnimate);
      opacity.value = withSpring(1, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    }, 200); // Adjust this duration to control the fade-out and fade-in timing
  }, [selectedDataAnimate]);

  const buttonText = useMemo(() => {
    if (availQuantity === 0) {
      return isRTL ? "غير متوفر الآن" : "Out of stock";
    }
    return isRTL ? "أضف إلى السلة" : "Add to Cart";
  }, [isRTL, availQuality]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelected([color, selected[1], selected[2]]);
  };

  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
    setSelected([selected[0], storage, selected[2]]);
  };

  const handleRamSelect = (ram: string) => {
    setSelectedRam(ram);
    setSelected([selected[0], selected[1], ram]);
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/verification");
      return;
    }

    const avail = data?.data?.attributes?.variants?.data?.find(
      (item: any) =>
        item.attributes?.color === selected[0] &&
        item.attributes?.storage === selected[1] &&
        item.attributes?.ram === selected[2]
    );

    if (!avail) {
      Alert.alert("Error", "Please select all options");
      return;
    }

    const baseData = {
      ...data?.data?.attributes,
      ...avail.attributes,
      id: avail.id,
      slug: data?.data?.attributes?.slug,
    };

    const cartItem = {
      ...baseData,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
    router.push("/cart");
  };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {!isTimeoutDone && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          <Loader />
        </View>
      )}
      <MotiView style={{ flex: 1 }}>
        <CustomHeader title={baseName} />
        <SafeAreaView style={{ flex: 1 }}>
          <ContentContainer showsVerticalScrollIndicator={false}>
            <Wrapper>
              <Swiper
                loop
                showsPagination
                dotStyle={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(0,0,0,0.2)",
                  marginBottom: 24,
                }}
                activeDotStyle={{
                  width: 20,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: Colors.dark.blue,
                  marginBottom: 24,
                }}
              >
                {image.map((item, index) => (
                  <Slide key={index}>
                    <Image
                      style={{
                        height: 240,
                        width: "100%",
                        resizeMode: "contain",
                      }}
                      source={{ uri: process.env.EXPO_PUBLIC_BASE + item }}
                    />
                  </Slide>
                ))}
              </Swiper>
            </Wrapper>

            <TextWrapper>
              <View style={{ overflow: "hidden" }}>
                <Animated.View style={titleAnimatedStyle}>
                  <Title>
                    {selectedData?.name
                      ? selectedData?.name
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")
                      : param.headerTitle}
                  </Title>
                </Animated.View>
              </View>

              <PriceWrapper>
                <View style={{ overflow: "hidden" }}>
                  <Animated.View style={[priceAnimatedStyle]}>
                    <NewPrice>
                      {selectedData?.price ? selectedData?.price : param.price}
                    </NewPrice>
                  </Animated.View>
                </View>
                {selectedData?.discount_price && (
                  <View style={{ overflow: "hidden" }}>
                    <Animated.View style={[discountPriceStyle]}>
                      <OldPrice>{selectedData?.discount_price}</OldPrice>
                    </Animated.View>
                  </View>
                )}
              </PriceWrapper>

              <QuanWrapper>
                <ShoppingCart size={18} color={Colors.dark.blue} />
                <ThemedText
                  type="subtitle"
                  style={{
                    color: Colors.dark.blue,
                    fontSize: 14,
                    opacity: 0.9,
                  }}
                >
                  {availQuantity < 4
                    ? isRTL
                      ? `متوفر ${availQuantity} قطع فقط!`
                      : `Only ${availQuantity} pieces left!`
                    : isRTL
                    ? `${availQuantity} قطع المتوفرة`
                    : `${availQuantity} pieces available`}
                </ThemedText>
              </QuanWrapper>
            </TextWrapper>

            <Line />

            {(allColor[0] || allRam || allStorage) && (
              <>
                <SectionTitle>
                  {isRTL ? "اختر الخيارات" : "Select Options"}
                </SectionTitle>
                <View style={{ paddingHorizontal: 16, gap: 16 }}>
                  {allColor[0] && (
                    <Color
                      defaultColor={defaultStorage?.color}
                      data={allColor}
                    />
                  )}
                  {allRam[0] && (
                    <VolumeRam defaultRam={defaultStorage?.ram} data={allRam} />
                  )}
                  {allStorage[0] && defaultStorage?.storage && (
                    <VolumeStorage
                      data={allStorage}
                      availablity={selectedBaseRam}
                      defaultStorage={defaultStorage.storage}
                    />
                  )}
                </View>
              </>
            )}

            <View style={{ height: 16 }} />

            <Quantity
              isRTL={isRTL}
              quantity={availQuantity}
              product={selectedData}
            />

            {selectedData?.product?.data?.attributes?.information?.map(
              (entity, index) => (
                <Collapsible
                  key={index}
                  title={entity.title}
                  style={{
                    backgroundColor: "white",
                    marginHorizontal: 16,
                    marginBottom: 12,
                    borderRadius: 16,
                    overflow: "hidden",
                    elevation: 1,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                  }}
                >
                  <ThemedText
                    style={{
                      backgroundColor: Colors.light.lightGray,
                      padding: 16,
                      borderRadius: 12,
                      fontSize: 14,
                      lineHeight: 22,
                      opacity: 0.9,
                    }}
                    type="subtitle"
                  >
                    {entity.description}
                  </ThemedText>
                </Collapsible>
              )
            )}

            <View style={{ height: 100 }} />
          </ContentContainer>

          <Button
            bg={availQuantity > 0 ? Colors.dark.blue : Colors.light.lightGray}
            style={{
              borderRadius: 16,
              height: 56,
            }}
            isfeatures={avail[0]?.features}
            selectedData={selectedData}
            quantity={availQuantity}
          >
            {buttonText}
          </Button>
        </SafeAreaView>
      </MotiView>
    </Animated.View>
  );
};

export default ProductDetail;
