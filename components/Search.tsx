import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import styled from "styled-components/native";

import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Search, X } from "lucide-react-native";
import SearchFilter from "./SearchFilter";
import { slides } from "@/util/dummy";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { ThemedText } from "./ThemedText";

const BaseWrapper = styled(View)`
  flex-direction: ${I18nManager.isRTL ? "row-reverse" : "row"};
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${Colors.light.border};
  border-radius: 8px;
  padding: 0 10px;
  min-height: 50px;
  max-height: 120px;
`;

// Extended Wrapper components
const Wrapper = styled(BaseWrapper)`
  margin: 0 15px;
`;

const WrapperClose = styled(BaseWrapper)`
  margin: 0;
`;
const TextField = styled(Text)`
  flex: 1;
  padding: 0 ${I18nManager.isRTL ? "10px" : "0px"} 0
    ${I18nManager.isRTL ? "10px" : "0px"};
  color: ${Colors.light.placeholder};
`;

const SearchIcon = styled(Feather)`
  color: ${Colors.dark.icon};
`;

const FilterIcon = styled(Ionicons)`
  color: ${Colors.dark.blue};
`;

export const SearchOpen = ({ data, style, onPress, isSearch }) => {
  const [input, setInput] = useState(""); // State to track the raw input
  const [stream, setStream] = useState<Item[]>([]);
  const focus = useRef<TextInput>(null);

  useEffect(() => {
    if (data) {
      setStream(data);
    }
  }, []);

  useEffect(() => {
    if (focus.current) {
      focus.current.focus();
    }
  }, [isSearch]);

  // Log to check if the input is changing twice

  return (
    <>
      <Wrapper style={style}>
        <X onPress={onPress} size={24} color="black" />
        <TextInput
          ref={focus}
          style={{
            flex: 1,
            paddingLeft: 10,
            paddingRight: I18nManager.isRTL ? 10 : 0,
            textAlign: I18nManager.isRTL ? "right" : "left",
          }}
          value={input}
          placeholder={
            I18nManager.isRTL ? "البحث عن المنتجات " : "Search for products"
          }
          onChangeText={(input) => setInput(input)}
        />
        <SearchIcon name="search" size={24} color="black" />
      </Wrapper>

      {/* Only display the search results after debounced input */}
      <SearchFilter setInput={setInput} input={input} data={stream} />
    </>
  );
};

export const SearchClose = ({ style, onPress, isSearch }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <WrapperClose style={style}>
        <FilterIcon name="filter" size={24} color="black" />
        <TextField>
          {I18nManager.isRTL ? "البحث عن المنتجات" : "Search for products"}
        </TextField>
        <SearchIcon name="search" size={24} color="black" />
      </WrapperClose>
    </TouchableOpacity>
  );
};
