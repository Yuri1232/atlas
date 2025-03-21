import { PropsWithChildren, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import React from "react";

// Enable smooth layout animations for Android

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  const toggleSection = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Animated.View layout={Layout} entering={FadeIn} style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggleSection}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={20}
          weight="medium"
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
          {title}
        </ThemedText>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View exiting={FadeOut} style={styles.content}>
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 100,
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.light.lightGray,
    overflow: "hidden",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
