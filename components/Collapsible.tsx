import { PropsWithChildren, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  withSpring,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import React from "react";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  const toggleSection = () => {
    setIsOpen((prev) => !prev);
  };

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(isOpen ? "90deg" : "0deg", {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      layout={Layout}
      entering={FadeIn.springify()}
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.heading,
          {
            backgroundColor:
              theme === "light"
                ? Colors.light.lightGray
                : Colors.dark.background,
          },
        ]}
        onPress={toggleSection}
        activeOpacity={0.7}
      >
        <Animated.View style={rotateStyle}>
          <IconSymbol
            name="chevron.right"
            size={22}
            weight="medium"
            color={theme === "light" ? Colors.light.blue : Colors.dark.blue}
          />
        </Animated.View>

        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.title,
            {
              color: theme === "light" ? Colors.light.blue : Colors.dark.blue,
            },
          ]}
        >
          {title}
        </ThemedText>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View exiting={FadeOut.springify()} style={styles.content}>
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 100,
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.border,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    marginTop: 12,
    marginLeft: 28,
  },
});
