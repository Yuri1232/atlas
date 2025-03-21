import { Collapsible } from "@/components/Collapsible";
import Color from "@/components/features/Color";
import Quantity from "@/components/features/Quantiy";
import VolumeStorage from "@/components/features/ValumeStorage";
import VolumeRam from "@/components/features/VolumeRam";
import globalStyles from "@/components/globalStyles";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import { PriceHandler } from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import { Colors } from "@/constants/Colors";
import { productDetailAction } from "@/states/prodcutDetail/productDetail";
import { HeaderTitileSetter, ramSetter } from "@/states/ui";
import { useLocalSearchParams, useNavigation } from "expo-router";
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
  height: 290px;
  margin-top: 40px;
`;

const Slide = styled(View)`
  justify-content: center;
  align-items: center;
  width: "100%";
  overflow: hidden;
`;

const TextWrapper = styled(Animated.View)`
  justify-content: space-between;
  gap: 10px;
`;

const Line = styled(View)`
  height: 1px;
  background-color: ${Colors.light.lightGray};
`;

const QuanWrapper = styled(View)`
  background-color: ${Colors.light.blue};
  align-self: flex-start;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
`;

const Title = styled(ThemedText)`
  font-size: 20px;
`;

const PriceWrapper = styled(View)`
  flex-direction: row;
  gap: 20px;
`;

const OldPrice = styled(ThemedText)`
  color: ${Colors.light.lightRed};
  font-size: 18px;
`;

const NewPrice = styled(ThemedText)`
  color: ${Colors.dark.price};
  font-size: 18px;
`;

const ProductDetail = () => {
  const { pData, pStatus } = useSelector((state) => state.products);
  const { color, ram, storage } = useSelector((state) => state.ui);
  const [stream, setStream] = useState([]);
  const [feature, setFeature] = useState({});
  const [selectedDataAnimate, setSelectedDataAnimate] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [baseName, setBaseName] = useState("");
  const [availColor, setAvailColor] = useState([]);
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

  const priceAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateYUp.value }],
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
    }, 1000);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(timer);
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

      const color = stream.map((item) => item.attributes.features.color);
      const ram = stream.map((item) => item.attributes.features.ram);
      const storage = stream.map((item) => item.attributes.features.storage);
      setAllColor(color);
      setAllRam(ram);
      setAllStorage(storage);
    }
  }, [stream]);

  const filterItems = (stream, filters) => {
    const avail = stream.filter((item) =>
      Object.entries(filters).every(
        ([key, value]) => !value || item?.features[key] === value
      )
    );

    setAvailStorage([...new Set(avail.map((item) => item?.features?.storage))]);
    setAvailQuality([...new Set(avail.map((item) => item?.features?.quality))]);
    setAvailQuantity(
      avail.reduce((sum, item) => sum + Number(item.features?.quantity), 0)
    );
    return avail;
  };

  useEffect(() => {
    if (stream) {
      const baseData = stream.map((item) => item?.attributes);
      if (baseData) {
        const selected = filterItems(baseData, { color, ram, storage });
        if (color && ram && storage) {
          setSelectedDataAnimate(selected?.[0]);
        } else if (color && ram && !storage) {
          setSelectedBaseRam(selected?.map((item) => item?.features?.storage));
        }
      }
      navigation.setOptions({ title: baseName });
    }
  }, [color, stream, ram, storage, baseName]);

  useEffect(() => {
    if (stream) {
      const baseData = stream.map((item) => item?.attributes);
      if (baseData) {
        const selected = filterItems(baseData, { color, ram });
        if (color && ram) {
          setSelectedBaseRam(selected?.map((item) => item?.features?.storage));
        }
      }
    }
  }, [color, stream, ram]);

  useEffect(() => {
    if (!selectedDataAnimate) return;
    // Trigger fade-out effect when the title or price is about to change
    opacity.value = withTiming(0, { duration: 0 });
    translateY.value = withTiming(200, { duration: 0 });
    translateYUp.value = withTiming(500, { duration: 0 });

    // Wait for the fade-out to finish, then fade-in with the new values
    setTimeout(() => {
      setSelectedData(selectedDataAnimate);
      opacity.value = withSpring(1, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      translateYUp.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, 200); // Adjust this duration to control the fade-out and fade-in timing
  }, [storage]);

  if (isTimeoutDone === false || !defaultStorage) {
    return <Loader />;
  } else if (defaultStorage.storage) {
    return (
      <Animated.View style={{ flex: 1, backgroundColor: "white" }}>
        <MotiView
          style={{ flex: 1 }}
          from={{ opacity: 0, translateY: 100 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          }}
        >
          <SafeAreaView style={[globalStyles.global]}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                gap: 10,
                flexGrow: 1,
              }}
            >
              <Wrapper>
                <Swiper
                  focusable
                  loadMinimal
                  loadMinimalSize={2}
                  loop
                  showsPagination
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
                    <Title type="defaultSemiBold">
                      {selectedData?.name
                        ? selectedData?.name
                        : param.headerTitle}
                    </Title>
                  </Animated.View>
                </View>

                <PriceWrapper>
                  <View style={{ overflow: "hidden" }}>
                    {selectedData?.discount_price && (
                      <Animated.View style={discountPriceStyle}>
                        <OldPrice
                          style={{
                            textDecorationLine: "line-through",
                            color: "red",
                            fontFamily: "Regular",
                          }}
                          type="title"
                        >
                          {selectedData?.discount_price}
                        </OldPrice>
                      </Animated.View>
                    )}
                  </View>

                  <View style={{ overflow: "hidden" }}>
                    <Animated.View style={[priceAnimatedStyle]}>
                      <NewPrice type="title">
                        {selectedData?.price
                          ? selectedData?.price
                          : param.price}
                      </NewPrice>
                    </Animated.View>
                  </View>
                </PriceWrapper>
              </TextWrapper>

              <QuanWrapper>
                <ShoppingCart size={20} />
                {availQuantity < 4 ? (
                  <ThemedText type="subtitle">
                    {isRTL
                      ? `متوفر ${availQuantity} قطع فقط!`
                      : `Only ${availQuantity} pieces are available!`}
                  </ThemedText>
                ) : (
                  <ThemedText type="subtitle">
                    {availQuantity}
                    {isRTL ? "قطع المتوفرة " : "pieces available "}
                  </ThemedText>
                )}
              </QuanWrapper>

              <Line />
              {allColor[0] && (
                <Color defaultColor={defaultStorage.color} data={allColor} />
              )}

              {allRam[0] && (
                <VolumeRam defaultRam={defaultStorage.ram} data={allRam} />
              )}
              {allStorage[0] && defaultStorage.storage && (
                <VolumeStorage
                  data={allStorage}
                  availablity={selectedBaseRam}
                />
              )}

              <Quantity isRTL={isRTL} quantity={availQuantity} />

              {!selectedData?.product?.data?.attributes?.information && (
                <View style={{ marginTop: 100 }} />
              )}
              {selectedData?.product?.data?.attributes?.information.map(
                (entity, index) => (
                  <Collapsible key={index} title={entity.title}>
                    <ThemedText
                      style={{
                        backgroundColor: Colors.light.lightGray,
                        flex: 1,
                      }}
                      type="subtitle"
                    >
                      {entity.description}
                    </ThemedText>
                  </Collapsible>
                )
              )}
            </ScrollView>
            <Button bg={Colors.light.green} style={{ marginTop: 10 }}>
              {isRTL ? "أضف إلى السلة" : "Add to Cart"}
            </Button>
          </SafeAreaView>
        </MotiView>
      </Animated.View>
    );
  }
};

export default ProductDetail;
