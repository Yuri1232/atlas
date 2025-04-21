import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  I18nManager,
  Dimensions,
  Platform,
} from "react-native";
import { ThemedText } from "./ThemedText";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface CheckoutReminderProps {
  onDismiss?: () => void;
  autoHideSeconds?: number;
}

const CheckoutReminder: React.FC<CheckoutReminderProps> = ({
  onDismiss,
  autoHideSeconds = 30,
}) => {
  const [visible, setVisible] = useState(true);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const pulseScale = useSharedValue(1);

  console.log("🔔 REMINDER COMPONENT MOUNTED");

  // Function to hide the notification
  const hideNotification = () => {
    console.log("🔔 HIDING REMINDER");
    translateY.value = withTiming(-100, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    opacity.value = withTiming(
      0,
      {
        duration: 300,
      },
      () => {
        runOnJS(setVisible)(false);
        onDismiss && runOnJS(onDismiss)();
      }
    );
  };

  useEffect(() => {
    console.log("🔔 REMINDER ANIMATION STARTING");

    // Trigger a small pulse animation on the icon
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1, // -1 for infinite repeats
      true // reverse animation
    );

    // Show notification animation with bouncy effect
    translateY.value = withSequence(
      withTiming(0, {
        duration: 800,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      }),
      withDelay(
        autoHideSeconds * 1000,
        withTiming(-100, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      )
    );

    // Also animate opacity and scale for better visual effect
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSequence(
      withTiming(1.05, { duration: 400 }),
      withTiming(1, { duration: 300 })
    );

    // Delayed auto-hide animation
    const timer = setTimeout(() => {
      console.log("🔔 AUTO-HIDING REMINDER");
      opacity.value = withTiming(0, { duration: 600 });
      setTimeout(() => {
        setVisible(false);
        onDismiss && onDismiss();
      }, 600);
    }, autoHideSeconds * 1000);

    return () => {
      console.log("🔔 REMINDER COMPONENT UNMOUNTING");
      clearTimeout(timer);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Animated.View style={pulseAnimatedStyle}>
          <Ionicons name="alarm" size={28} color="#ff3b30" />
        </Animated.View>
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>
          {I18nManager.isRTL
            ? "اسرع قبل نفاد الكمية!"
            : "Check out before they run out!"}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {I18nManager.isRTL
            ? "أكمل عملية الشراء الآن لتأمين منتجاتك"
            : "Complete your purchase now to secure your items"}
        </ThemedText>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={hideNotification}>
        <Ionicons name="close" size={20} color="#666" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 24,
    zIndex: 9999,
    marginTop: Platform.OS === "ios" ? 50 : 35,
    borderRadius: 16,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ffeeee",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffeeee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Bold",
    marginBottom: 6,
    color: "#1a1a1a",
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CheckoutReminder;
