import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  I18nManager,
} from "react-native";
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import styled from "styled-components";
import { Colors } from "@/constants/Colors";
import { Search } from "lucide-react-native";
import { CardRender } from "./ui/Card";

export const RenderItem = ({ item, index }) => {
  return item.isPlaceholder ? (
    <View style={styles.placeholder} />
  ) : (
    <View key={item.slug}>
      <CardRender key={index} item={item} index={index} />
    </View>
  );
};

const SearchFilter = ({ data, input, setInput }) => {
  const [isPress, setIsPress] = useState(false);
  const [searchEngine, setSearchEngine] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

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

  const Wrapper = styled(MotiView)`
    position: relative;
    left: 0px;
    background: ${Colors.light.blue};
    border-radius: 10px;
    padding: 10px 10px;
    margin: 5px 15px;
    gap: 4px;
  `;

  const TextWrapper = styled(MotiView)`
    background: ${Colors.dark.blue};
    padding: 10px 10px;
    border-radius: 5px;
    font-size: 13px;
  `;
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
          key={searchResult.length} // ✅ Key ensures animation updates dynamically
          from={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          {searchResult.map((item, key) => (
            <TouchableOpacity
              key={item.name} // Add unique key prop
              onPress={() => {
                setIsPress(true), setInput(item.name);
              }}
            >
              <TextWrapper
                key={item.name} // ✅ Ensures smooth entry/exit animations for each item
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: key * 100,
                }}
              >
                <ThemedText style={{ color: "white" }} type="subtitle">
                  {item.name}
                </ThemedText>
              </TextWrapper>
            </TouchableOpacity>
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
