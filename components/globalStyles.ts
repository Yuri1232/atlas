// globalStyles.js
import { StyleSheet, Platform } from "react-native";

const globalStyles = StyleSheet.create({
  global: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 50 : 0,
    position: "relative",
  },
});

export default globalStyles;
