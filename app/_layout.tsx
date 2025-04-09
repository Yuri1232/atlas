import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Stack,
  useLocalSearchParams,
  Slot,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/states/store";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import auth from "@react-native-firebase/auth";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import CustomSplashScreen from "@/components/SplashScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This hook will protect the route access based on user authentication
function useProtectedRoute(isAuthenticated: boolean | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't navigate if we're still checking authentication
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inProfileScreen = segments[0] === "profile";

    // Only redirect authenticated users away from auth screens
    if (isAuthenticated && inAuthGroup) {
      router.replace("/profile");
    }
  }, [isAuthenticated, segments]);
}

const HeaderBackground = ({ tint }: { tint: "light" | "dark" }) => {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={StyleSheet.absoluteFill}
    >
      <BlurView
        intensity={Platform.select({ ios: 70, android: 100 })}
        tint={tint}
        style={[
          {
            flex: 1,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor:
              tint === "light"
                ? Colors.light.background
                : Colors.dark.background,
            ...Platform.select({
              ios: {
                shadowColor:
                  tint === "light"
                    ? Colors.light.background
                    : Colors.dark.background,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              android: {
                elevation: 2,
              },
            }),
          },
        ]}
      />
    </Animated.View>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  useProtectedRoute(isAuthenticated);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Show custom splash screen while loading
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading indicator while checking authentication or loading fonts
  if (!loaded || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_bottom",
            animationDuration: 200,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="productDetail/[id]" />
          <Stack.Screen name="products/[id]" />
          <Stack.Screen
            name="modal/cart"
            options={{
              presentation: "transparentModal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen name="checkOut/CheckOut" />
          <Stack.Screen name="address/addressList" />
          <Stack.Screen name="modal/add-address" />
          <Stack.Screen name="payment/payment" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </Provider>
  );
}
