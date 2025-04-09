import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  return (
    <LinearGradient
      colors={["#2563EB", "#1E40AF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons
          name={"chevron-back"}
          size={28}
          color={isDark ? "#fff" : "#fff"}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? "#fff" : "#fff" }]}>
        {title}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 15,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Regular",
    flex: 1,
    letterSpacing: 0.5,
  },
});

export default CustomHeader;
