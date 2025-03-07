import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  I18nManager,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch, useSelector } from "react-redux";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
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

SplashScreen.preventAutoHideAsync();

const SearchWindow = styled(MotiView)`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 11;
  width: 100%;
  height: 50%;
  background-color: white;
  overflow: hidden;
`;

const HomeScreen: React.FC = () => {
  const [isSearch, setIsSearch] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.home);
  const { pData, pStatus } = useSelector((state: RootState) => state.products);
  const { locale } = useSelector((state: RootState) => state.ui);
  const [stream, setStream] = useState([]);
  const [discountProduct, setDiscountProduct] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(homeAction(locale));
    dispatch(productAction(locale));
  }, [locale, dispatch]);

  useEffect(() => {
    if (pStatus === "succeeded" && pData) {
      setProducts(pData.data.map((item) => item.attributes));
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

  useEffect(() => {
    if (pStatus === "succeeded" && pData) {
      dispatch(toggleSlider(pData.data[0].attributes.locale));
    }
  }, [pStatus, pData, dispatch]);
  useEffect(() => {
    I18nManager.allowRTL(!false);
    I18nManager.forceRTL(!false);
    const toggleRTL = async () => {
      const isRTL = I18nManager.isRTL; // Check current direction
      try {
        // in production mode this will reload the app
        //await Updates.reloadAsync();
      } catch (error) {
        console.error("Error reloading app: ", error);
        // Works in bare React Native apps
      }
    };
    toggleRTL();
  }, []);

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

  if (!loaded && !error) {
    return null;
  }

  if (status === "loading") {
    return <Loader />;
  } else if (pStatus === "loading") {
    return <Loader />;
  } else {
    return (
      <SafeAreaView style={globalStyles.global}>
        <SearchWindow
          from={{ height: "0%", opacity: 0 }}
          animate={{
            height: isSearch ? "100%" : "0%",
            opacity: isSearch ? 1 : 0,
          }}
          transition={{
            type: "timing",
            duration: 0,
          }}
        >
          <SearchOpen
            isSearch={isSearch}
            data={products}
            onPress={() => setIsSearch(false)}
          />
        </SearchWindow>

        {/* Scrollable Content Using FlatList */}
        <FlatList
          data={stream}
          keyExtractor={(item) => item.category}
          renderItem={({ item, index }) => (
            <Card
              key={item.category}
              data={products}
              cat={item.category}
              style={{ marginBottom: 32 }} // Add gap between each component
              // Navigate to product details
            />
          )}
          ListHeaderComponent={() => (
            <>
              <SearchClose
                isSearch={isSearch}
                onPress={() => setIsSearch(true)}
                style={{ marginBottom: 32 }} // Add gap for the close button
              />
              <CustomSwiper
                data={data}
                status={status}
                style={{ marginBottom: 32 }}
              />
              <Category data={data} style={{ marginBottom: 32 }} />
              {discountProduct.length > 0 && (
                <Card
                  data={discountProduct}
                  isDiscount={true}
                  style={{ marginBottom: 32 }} // Add gap for the discount card
                />
              )}
            </>
          )}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 15,
          }}
        />
      </SafeAreaView>
    );
  }
};

export default HomeScreen;
