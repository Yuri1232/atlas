import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  I18nManager,
  Keyboard,
} from "react-native";
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import { Search, ArrowRight } from "lucide-react-native";
import { CardRender } from "./ui/Card";

export const RenderItem = ({ item, index }) => {
  return item.isPlaceholder ? (
    <View style={styles.placeholder} />
  ) : (
    <View key={item.slug}>
      <CardRender key={index} item={item} index={index} isHorzontal={false} />
    </View>
  );
};

const Wrapper = styled(MotiView)`
  background: white;
  border-radius: 16px;
  margin: 8px 15px;
  padding: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

const SuggestionItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.isHighlighted ? "rgba(37, 99, 235, 0.1)" : "transparent"};
`;

const HighlightText = ({ text, highlight }) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <ThemedText style={{ fontSize: 15, lineHeight: 20 }}>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <ThemedText
            key={i}
            style={{ color: Colors.light.blue, fontFamily: "SemiBold" }}
          >
            {part}
          </ThemedText>
        ) : (
          <ThemedText key={i} style={{ color: "#1a1a1a" }}>
            {part}
          </ThemedText>
        )
      )}
    </ThemedText>
  );
};

const SearchFilter = ({ data, input, setInput }) => {
  const [isPress, setIsPress] = useState(false);
  const [searchEngine, setSearchEngine] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Calculate number of columns based on screen width
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = 150; // Width of each item
  const numColumns = Math.floor(screenWidth / itemWidth);

  // helper method to keep the last item align to the left.
  const adjustedItems =
    searchEngine.length % 2 !== 0
      ? [...searchEngine, { isPlaceholder: true }]
      : searchEngine;
  useEffect(() => {
    const inputCaseFree = input.toLowerCase();

    const filterEngine = data.filter((item) => {
      if (inputCaseFree.length === 0) return false; // Return false instead of null

      // Ensure description is split into individual words
      const wordSplit = item.name.split(" ");

      // Check if every word in input matches at least one word in description
      const inputWords = inputCaseFree.split(" ");

      const matches = inputWords.every((inputWord) =>
        wordSplit.some((descWord) =>
          descWord.toLowerCase().startsWith(inputWord.toLowerCase())
        )
      );
      return matches;
    });
    setSearchEngine(filterEngine);
    setSearchResult(filterEngine);
    setIsPress(false);
  }, [input]);

  useEffect(() => {
    if (isPress) {
      setSearchResult([]);
    }
  }, [isPress]);

  useEffect(() => {
    // Add a listener to detect when the keyboard is dismissed
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setSearchResult([]); // Hide suggestions when the keyboard is dismissed
    });

    // Clean up the listener when the component is unmounted
    return () => {
      keyboardHideListener.remove();
    };
  }, []);

  const SearchLogoWrapper = styled(View)`
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0.5;
    justify-content: center;
    align-items: center;
  `;
  return (
    <>
      {searchResult.length > 0 && (
        <Wrapper
          from={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 250 }}
        >
          {searchResult.map((item, index) => (
            <SuggestionItem
              key={item.name}
              isHighlighted={index === highlightedIndex}
              onPress={() => {
                setIsPress(true);
                setInput(item.name);
              }}
              onPressIn={() => setHighlightedIndex(index)}
              onPressOut={() => {
                setHighlightedIndex(-1);
                // Delay hiding search suggestions to allow for any touch actions
                setTimeout(() => {
                  setSearchResult([]); // Hide suggestions after press out
                }, 200); // Adjust timeout duration as needed
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Search
                  size={16}
                  color={Colors.light.blue}
                  style={{ marginRight: 12 }}
                />
                <HighlightText text={item.name} highlight={input} />
              </View>
              <ArrowRight size={16} color="#999" />
            </SuggestionItem>
          ))}
        </Wrapper>
      )}

      <FlatList
        numColumns={numColumns} // Use dynamically calculated numColumns
        contentContainerStyle={{
          paddingVertical: 30,
          marginHorizontal: 25,
        }}
        columnWrapperStyle={{
          justifyContent: "center",
          marginBottom: 30,
          gap: 40,
        }} // Add space between columns
        data={adjustedItems}
        renderItem={({ item, index }) => (
          <RenderItem key={index} item={item} index={index} /> // Add unique key prop
        )}
      ></FlatList>
      {searchEngine.length === 0 && (
        <SearchLogoWrapper
          style={{
            transform: [
              { translateX: I18nManager.isRTL ? "50%" : "50%" },
              { translateY: "-50%" },
            ],
          }}
        >
          <Search color={Colors.light.blue} size={140} />
          <ThemedText>No result found</ThemedText>
        </SearchLogoWrapper>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    width: 150,
    opacity: 0,
  },
});

export default SearchFilter;
