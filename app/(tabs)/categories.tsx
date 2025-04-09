import CategoryView from "@/components/CategoryView";
import { ThemedText } from "@/components/ThemedText";
import Loader from "@/components/ui/Loader";
import { homeAction } from "@/states/home/home";
import { RootState } from "@/states/store";
import { HeaderTitileSetter } from "@/states/ui";
import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
  FlatList,
  I18nManager,
  SafeAreaView,
  View,
  Animated,
  Easing,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled(LinearGradient)`
  padding: 24px 20px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  elevation: 8;
`;

const Title = styled(ThemedText)`
  font-size: 36px;
  line-height: 44px;
  font-family: "Bold";
  color: #ffffff;
  margin-bottom: 20px;
  text-align: ${I18nManager.isRTL ? "right" : "left"};
`;

const SearchContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0 20px;
  height: 56px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  font-family: "Regular";
  margin-left: 16px;
  color: #ffffff;
`;

const GridContainer = styled(View)`
  flex: 1;
  padding: 16px;
`;

const CategoryCard = styled(TouchableOpacity)`
  width: 100%;
  height: 160px;
  margin-bottom: 16px;
  overflow: hidden;
  border-radius: 20px;
`;

const ImageContainer = styled(View)`
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
`;

const CardImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Gradient = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const CardContent = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 24px;
  justify-content: center;
  align-items: flex-end;
`;

const CategoryTitle = styled(ThemedText)`
  font-size: 28px;
  font-family: "Bold";
  color: #ffffff;
  text-align: right;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 32px;
`;

const BackButton = styled(TouchableOpacity)`
  position: absolute;
  left: ${I18nManager.isRTL ? "24px" : "auto"};
  right: ${I18nManager.isRTL ? "auto" : "24px"};
  top: 50%;
  margin-top: -20px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.25);
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
`;

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 3,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, []);

  const [cat, setCat] = useState([]);
  const param = useLocalSearchParams();
  const { data, status } = useSelector((state: RootState) => state.home);
  const { locale } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderTitileSetter(param.id));
    dispatch(homeAction(locale));
  }, []);

  useEffect(() => {
    if (status === "succeeded" && data) {
      const categories = data.card;
      setCat(categories);
    }
  }, [status, data]);

  if (status === "loading") {
    return <Loader />;
  }

  const filteredCategories = cat.filter((item) =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getItemAnimation = (index: number) => {
    const itemFade = new Animated.Value(0);
    const itemTranslate = new Animated.Value(20);

    Animated.parallel([
      Animated.timing(itemFade, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(itemTranslate, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();

    return {
      opacity: itemFade,
      transform: [{ translateY: itemTranslate }],
    };
  };

  return (
    <Container>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY }],
        }}
      >
        <Header
          colors={["#2563EB", "#1E40AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Title>{I18nManager.isRTL ? "الفئات" : "Categories"}</Title>
          <SearchContainer>
            <Ionicons name="search-outline" size={20} color="#FFFFFF" />
            <SearchInput
              placeholder={
                I18nManager.isRTL ? "ابحث عن الفئات" : "Search categories"
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </SearchContainer>
        </Header>

        <GridContainer>
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.category}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Animated.View style={getItemAnimation(index)}>
                <CategoryCard
                  activeOpacity={0.9}
                  onPress={() => {
                    // Handle category selection
                  }}
                >
                  <ImageContainer>
                    {item.logo ? (
                      <CardImage
                        source={{
                          uri:
                            process.env.EXPO_PUBLIC_BASE +
                            item.logo.data.attributes.url,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#E5E7EB",
                        }}
                      >
                        <Ionicons
                          name="image-outline"
                          size={32}
                          color="rgba(26, 26, 26, 0.2)"
                        />
                      </View>
                    )}
                    <Gradient />
                    <CardContent>
                      <CategoryTitle>{item.category}</CategoryTitle>
                    </CardContent>
                    <BackButton>
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#FFFFFF"
                      />
                    </BackButton>
                  </ImageContainer>
                </CategoryCard>
              </Animated.View>
            )}
          />
        </GridContainer>
      </Animated.View>
    </Container>
  );
};

export default Categories;
