import { Colors } from "@/constants/Colors";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
  I18nManager,
} from "react-native";
import styled from "styled-components/native";

const { width: widthScreen } = Dimensions.get("window");
const width = widthScreen * 0.835;

// Styled components
const SwiperContainer = styled(View)`
  width: 90%;
  height: 155px;
  border-radius: 10px;
  overflow: hidden;
`;

const PaginationDot = styled(View)<{ active: boolean }>`
  width: ${({ active }) => (active ? "55px" : "8px")};
  height: 8px;
  border-radius: 10px;
  margin: 5px;
  background-color: ${({ active }) =>
    active ? Colors.dark.blue : Colors.light.blue};
`;

interface CustomSwiperProps {
  data: {
    data: {
      slider: { id: string; attributes: { id: string; url: string } }[];
    };
  };
  style?: ViewStyle;
  status: string;
}

const CustomSwiper: React.FC<CustomSwiperProps> = ({ data, style, status }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<{ id: string; url: string }> | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [stream, setStream] = useState<{ id: string; url: string }[]>([]);

  // Ensure id exists in the stream data
  useEffect(() => {
    if (status === "succeeded" && data) {
      setStream(
        data.slider.data.map((item) => ({
          id: item.attributes.id || item.id, // Ensure id exists
          url: item.attributes.url,
        }))
      );
    }
  }, [status, data]);

  // Function to start autoplay
  const startAutoplay = () => {
    if (stream.length > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % stream.length;

          if (I18nManager.isRTL) {
            flatListRef.current?.scrollToIndex({
              index: stream.length - nextIndex - 1,
              animated: true,
            });
          } else {
            flatListRef.current?.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
          }

          return nextIndex;
        });
      }, 3000);
    }
  };

  // Start autoplay when component mounts
  useEffect(() => {
    startAutoplay();
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [stream]);

  // Detect user manual scroll
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
    clearInterval(intervalRef.current!); // Stop autoplay temporarily
    startAutoplay(); // Restart autoplay from new index
  };

  return (
    <View style={[{ alignItems: "center" }, style]}>
      <SwiperContainer>
        <FlatList
          ref={flatListRef}
          data={stream}
          keyExtractor={(item) => item.id} // ✅ Ensure each item has a unique key
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item }) => (
            <Image
              style={{
                width,
                height: "100%",
                borderRadius: 10,
                resizeMode: "cover",
                alignSelf: "center",
              }}
              source={{ uri: process.env.EXPO_PUBLIC_BASE + item.url }}
            />
          )}
        />
      </SwiperContainer>

      {/* Custom Pagination */}
      <View style={styles.paginationContainer}>
        {stream.map((item, index) => (
          <PaginationDot key={item.id} active={index === currentIndex} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});

export default CustomSwiper;
