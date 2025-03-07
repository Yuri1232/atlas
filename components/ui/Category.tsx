import {
  FlatList,
  I18nManager,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ThemedText";
import styled from "styled-components";
import { TitleWrapper } from "./Card";
import Expand from "./ExpandIcon";
import { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const Wrapper = styled(View)`
  width: 120px;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
const WrapperImage = styled(View)`
  width: 60px;
  border-radius: 30px;
  overflow: hidden;
`;
const CatImage = styled(Image)`
  width: 100%;
  height: 60px;
  object-fit: cover;
`;

export const CategoryRender = ({ item }) => {
  const route = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        route.setParams({ cat: item.category });
        route.push(`/products${item.category}`);
      }}
    >
      <Wrapper>
        <WrapperImage>
          <CatImage
            source={{
              uri:
                process.env.EXPO_PUBLIC_BASE + item.logo.data.attributes?.url,
            }}
          />
        </WrapperImage>
        <ThemedText numberOfLines={1} type="subtitle">
          {item.category}
        </ThemedText>
      </Wrapper>
    </TouchableOpacity>
  );
};
const Category = ({ data, style }) => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (data) {
      setStream(data.card);
    }
  }, [data]);
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TitleWrapper>
          <ThemedText
            type="defaultSemiBold"
            style={{
              verticalAlign: "middle",
            }}
          >
            {I18nManager.isRTL ? "الفئات" : "Categories"}
          </ThemedText>
        </TitleWrapper>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(tabs)/categories",
              params: {
                headerTitle: I18nManager.isRTL ? "الفئات" : "Categories",
              },
            });
          }}
        >
          <TitleWrapper>
            <ThemedText type="subtitle">
              {I18nManager.isRTL ? "شاهد المزيد" : "See more"}
            </ThemedText>
            {I18nManager.isRTL ? (
              <ChevronLeft style={{ marginRight: 5 }} size={20} color="black" />
            ) : (
              <ChevronRight
                style={{ marginRight: 15 }}
                size={20}
                color="black"
              />
            )}
          </TitleWrapper>
        </TouchableOpacity>
      </View>
      <FlatList
        style={[{}, style]}
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        inverted={I18nManager.isRTL}
        data={stream}
        renderItem={({ item }) => {
          return <CategoryRender item={item} />;
        }}
      />
    </>
  );
};

export default Category;
