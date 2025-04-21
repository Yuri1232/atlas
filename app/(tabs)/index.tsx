import React, { useEffect, useState, useCallback, memo } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  I18nManager,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch, useSelector } from "react-redux";
import { MotiView } from "moti";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedRef,
  useAnimatedScrollHandler,
  Extrapolate,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
import styled from "styled-components/native";
import Card from "@/components/ui/Card";
import Search, { SearchClose, SearchOpen } from "@/components/Search";
import CustomSwiper from "@/components/Swiper";
import { Colors } from "@/constants/Colors";
import { homeAction } from "@/states/home/home";
import { productAction } from "@/states/product/product";
import { AppDispatch, RootState } from "@/states/store";
import { toggleSlider } from "@/states/ui";
import Categories from "./categories";
import Category from "@/components/ui/Category";
import { Link, router } from "expo-router";
import globalStyles from "@/components/globalStyles";
import Loader from "@/components/ui/Loader";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/hooks/useUser";

const { width } = Dimensions.get("window");

SplashScreen.preventAutoHideAsync();

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

const SearchBackdrop = styled(MotiView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const SearchWindow = styled(MotiView)`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 11;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 5;
`;

const ContentContainer = styled(View)`
  flex: 1;

  z-index: 1;
`;

const HeaderContainer = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 24px 20px;
  padding-top: 55px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 5;
`;

const HeaderContent = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const TextContainer = styled(View)`
  flex: 1;
  align-items: flex-end;
`;

const WelcomeText = styled(Text)`
  font-size: 28px;
  font-family: "Bold";
  color: #fff;
  margin-bottom: 8px;
  text-align: right;
`;

const SubText = styled(Text)`
  font-size: 16px;
  font-family: "Regular";
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
`;

const SearchCloseContainer = styled(View)`
  margin: 0 16px 16px 16px;
  background-color: rgba(245, 245, 245, 0.95);
  border-radius: 12px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const SearchPlaceholder = styled(Text)`
  font-size: 15px;
  font-family: "Regular";
  color: #666;
  flex: 1;
  text-align: right;
  margin-right: 12px;
`;

const SearchIcon = styled(View)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #1a1a1a;
  justify-content: center;
  align-items: center;
`;

const SwiperContainer = styled(View)`
  margin: 0 16px 24px 16px;
  border-radius: 20px;
  overflow: hidden;
  height: 180px;
`;

const CardContainer = styled(View)`
  margin: 0 16px 24px 16px;
  background-color: transparent;
  border-radius: 20px;
`;

const DiscountContainer = styled(View)`
  margin: 8px 16px 24px 16px;
`;

const DiscountTitle = styled(Text)`
  font-size: 22px;
  font-family: "Bold";
  color: #1a1a1a;
  margin-bottom: 16px;
  text-align: right;
`;

const DiscountCard = styled(View)`
  background-color: transparent;
  border-radius: 20px;
  overflow: hidden;
`;

const SectionTitle = styled(Text)`
  font-size: 22px;
  font-family: "Bold";
  color: #1a1a1a;
  margin: 0 16px 16px 16px;
  text-align: right;
`;

const GlobeContainer = styled(View)`
  width: 50px;
  height: 50px;
  margin-right: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.1);
`;

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const AnimatedHeaderContainer =
  Animated.createAnimatedComponent(HeaderContainer);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Memoized Search Component
const MemoizedSearch = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <SearchCloseContainer>
      <SearchIcon>
        <Ionicons name="search" size={18} color="#fff" />
      </SearchIcon>
      <SearchPlaceholder>البحث عن المنتجات</SearchPlaceholder>
    </SearchCloseContainer>
  </TouchableOpacity>
));

// Memoized Swiper Component
const MemoizedSwiper = memo(
  ({ data, status }: { data: any; status: string }) => (
    <SwiperContainer>
      <CustomSwiper data={data} status={status} />
    </SwiperContainer>
  )
);

// Memoized Discount Card Component
const MemoizedDiscountCard = memo(({ products }: { products: any[] }) => (
  <DiscountContainer>
    <DiscountCard>
      <Card data={products} isDiscount={true} />
    </DiscountCard>
  </DiscountContainer>
));

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isSearch, setIsSearch] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.home);
  const { pData, pStatus } = useSelector((state: RootState) => state.products);
  const { locale } = useSelector((state: RootState) => state.ui);
  const [stream, setStream] = useState([]);
  const [discountProduct, setDiscountProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollY = useSharedValue(0);
  const flatListRef = React.useRef<FlatList>(null);
  const [stopGlobe, setStopGlobe] = useState(false);
  const headerHeight = insets.top + 120;
  const { getCart } = useUser();
  // Memoized data fetching
  useEffect(() => {
    dispatch(homeAction(locale));
    dispatch(productAction(locale));
    getCart();
  }, [locale, dispatch]);

  // Optimized data processing
  useEffect(() => {
    if (pStatus === "succeeded" && pData) {
      const allProducts = pData.data.map((item) => item.attributes);
      setProducts(allProducts);
    }
  }, [pStatus, pData]);

  useEffect(() => {
    if (status === "succeeded" && data) {
      setStream(data.card);
    }
  }, [status, data]);

  useEffect(() => {
    if (pStatus === "succeeded" && products.length) {
      setDiscountProduct(products.filter((item) => item.discount === true));
    }
  }, [pStatus, products]);

  // Memoized font loading
  const [loaded, error] = useFonts({
    Thin: require("@/assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),
    ExtraLight: require("@/assets/fonts/Montserrat/static/Montserrat-ExtraLight.ttf"),
    Light: require("@/assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    Regular: require("@/assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    Medium: require("@/assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    SemiBold: require("@/assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    Bold: require("@/assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    ExtraBold: require("@/assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Optimized scroll handler with reduced complexity
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Only update scrollY if the change is significant
      if (Math.abs(scrollY.value - event.contentOffset.y) > 1) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  // Simplified header animation style
  const headerAnimatedStyle = useAnimatedStyle(() => {
    // Use a simpler interpolation for better performance
    const translateY = Math.min(Math.max(scrollY.value * -0.3, -85), 0);

    return {
      transform: [{ translateY }],
      opacity: 1, // Remove opacity animation for better performance
    };
  });

  // Remove unused animation values
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(0);

  // Simplified globe style without color interpolation
  const globeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
      color: Colors.dark.blue,
      fontSize: 30,
    };
  });

  // Memoized render item
  const renderItem = useCallback(
    ({ item }) => (
      <CardContainer>
        <Card data={products} cat={item.category} />
      </CardContainer>
    ),
    [products]
  );

  // Memoized header component
  const ListHeaderComponent = useCallback(
    () => (
      <>
        <MemoizedSearch onPress={() => router.push("/search")} />
        <MemoizedSwiper data={data} status={status} />
        {discountProduct.length > 0 && (
          <MemoizedDiscountCard products={discountProduct} />
        )}
        <SectionTitle>
          {I18nManager.isRTL ? "الفئات" : "Categories"}
        </SectionTitle>
      </>
    ),
    [data, status, discountProduct]
  );

  if (!loaded && !error) {
    return null;
  }

  if (status === "loading" || pStatus === "loading") {
    return <Loader />;
  }

  return (
    <Container>
      <StatusBar barStyle="light-content" />

      <AnimatedHeaderContainer
        colors={["#2563EB", "#1E40AF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={headerAnimatedStyle}
      >
        <HeaderContent>
          <GlobeContainer>
            <Animated.Text style={[globeStyle, { transformOrigin: "center" }]}>
              🌍
            </Animated.Text>
          </GlobeContainer>
          <TextContainer>
            <WelcomeText>مرحباً بك في أطلس</WelcomeText>
            <SubText>اكتشف أحدث المنتجات والعروض</SubText>
          </TextContainer>
        </HeaderContent>
      </AnimatedHeaderContainer>

      <ContentContainer headerHeight={headerHeight}>
        <AnimatedFlatList
          ref={flatListRef}
          data={stream}
          keyExtractor={(item) => item.category}
          onScroll={scrollHandler}
          scrollEventThrottle={32} // Reduced from 16 to 32 for better performance
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
            paddingTop: 180,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3} // Reduced from 5 to 3
          windowSize={3} // Reduced from 5 to 3
          initialNumToRender={2} // Reduced from 3 to 2
          updateCellsBatchingPeriod={100} // Increased from 50 to 100
          getItemLayout={(data, index) => ({
            length: 200, // Approximate height of each item
            offset: 200 * index,
            index,
          })}
        />
      </ContentContainer>
    </Container>
  );
};

export default memo(HomeScreen);
