import {
  View,
  TextInput,
  TouchableOpacity,
  I18nManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Search } from "lucide-react-native";
import SearchFilter from "./SearchFilter";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { ThemedText } from "./ThemedText";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";

const Wrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  padding: 0 8px;
  color: #1a1a1a;
  font-size: 15px;
  font-family: "Regular";
  text-align: ${I18nManager.isRTL ? "right" : "left"};
`;

const SearchButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const PlaceholderText = styled(ThemedText)`
  color: #999;
  font-size: 16px;
  font-family: "Regular";
`;

export const SearchOpen = ({ data, style, onPress, isSearch }) => {
  const [input, setInput] = useState("");
  const [stream, setStream] = useState([]);
  const focus = useRef(null);

  useEffect(() => {
    if (data) {
      setStream(data);
    }
  }, []);

  useEffect(() => {
    if (focus.current && isSearch) {
      focus.current.focus();
    }
  }, [isSearch]);

  return (
    <>
      <Wrapper>
        <SearchInput
          ref={focus}
          value={input}
          placeholder={
            I18nManager.isRTL ? "البحث عن المنتجات" : "Search for products"
          }
          placeholderTextColor="#999"
          onChangeText={setInput}
        />
        <SearchButton onPress={onPress}>
          <Ionicons name="search" size={20} color="#666" />
        </SearchButton>
      </Wrapper>
      {input.length > 0 && (
        <SearchFilter setInput={setInput} input={input} data={stream} />
      )}
    </>
  );
};
