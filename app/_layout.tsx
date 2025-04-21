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
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/states/store";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import auth from "@react-native-firebase/auth";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import CustomSplashScreen from "@/components/SplashScreen";
import CheckoutReminder from "@/components/CheckoutReminder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCustomer } from "@/states/user/user";
import { CartGetAction } from "@/states/user/cart";
import { addToCart } from "@/states/ui/cart";
import { ThemedText } from "@/components/ThemedText";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// For testing - clear reminder timestamp on app load to force it to show
// Remove this in production!
AsyncStorage.removeItem("checkout_reminder_last_shown").catch((err) =>
  console.log("Error clearing reminder timestamp:", err)
);

// This hook will protect the route access based on user authentication
function useProtectedRoute(isAuthenticated: boolean | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't navigate if we're still checking authentication
    if (isAuthenticated === null) return;

    // Check if current route is in the auth group by comparing first segment
    const inAuthGroup = segments[0] === "(auth)";

    // Only redirect authenticated users away from auth screens
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, router]);
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

// Function to initialize user data in Redux store
const initializeUserData = async (userId: string) => {
  try {
    // Load user data into Redux store
    await store.dispatch(getCustomer(userId));

    // Load cart data from backend
    const response = await store.dispatch(CartGetAction());

    // If backend cart has items, sync them to local cart state
    if (
      response.payload &&
      response.payload?.data &&
      response.payload.data.length > 0
    ) {
      // Filter for current user's items
      const userItems = response.payload.data.filter(
        (item: any) =>
          item.attributes.customer?.data?.attributes?.slug === userId
      );

      // Add each item to local cart
      for (const item of userItems) {
        const productData = item.attributes.product?.data;
        const cartItem = {
          ...productData,
        };
        // Dispatch to local cart state
        console.log("xxxxxzzzzz", cartItem);
        store.dispatch(addToCart(cartItem));
      }
    }

    return true;
  } catch (error) {
    console.error("Error loading user data:", error);
    return false;
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  useProtectedRoute(isAuthenticated);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Configure Firebase auth persistence and state listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Ensure Firebase has initialized and synced with server before checking
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check auth state directly
        const currentUser = auth().currentUser;
        console.log(
          "Initial auth check:",
          currentUser ? `User ID: ${currentUser.uid}` : "No user"
        );

        // Set authenticated state
        setIsAuthenticated(!!currentUser);

        // Initialize user data in Redux store if logged in
        if (currentUser?.uid) {
          await initializeUserData(currentUser.uid);
        }

        setAuthInitialized(true);
        setDataInitialized(true);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthInitialized(true);
        setDataInitialized(true);
      }
    };

    // Initialize auth on app start
    initializeAuth();

    // Also set up listener for auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      console.log(
        "Auth state changed:",
        user ? `User ID: ${user.uid}` : "No user"
      );

      setIsAuthenticated(!!user);

      // Load user data on auth state change
      if (user?.uid) {
        await initializeUserData(user.uid);
      }

      setAuthInitialized(true);
      setDataInitialized(true);
    });

    return unsubscribe;
  }, []);

  // Check if we should show the reminder
  useEffect(() => {
    const checkReminderStatus = async () => {
      try {
        // Only show reminder for logged in users
        if (!isAuthenticated) {
          console.log("Not showing reminder: User not authenticated");
          return;
        }

        console.log("Checking reminder status for authenticated user");
        const reminderKey = "checkout_reminder_last_shown";
        const lastShown = await AsyncStorage.getItem(reminderKey);
        const currentTime = new Date().getTime();

        console.log(
          "Last reminder shown:",
          lastShown ? new Date(parseInt(lastShown)).toLocaleString() : "Never"
        );

        // Show reminder if never shown before or last shown more than 24 hours ago
        // For testing, use a shorter interval (5 minutes = 300000 ms)
        const testInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
        const productionInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // Use shorter interval for testing
        const timeThreshold = testInterval;

        if (!lastShown || currentTime - parseInt(lastShown) > timeThreshold) {
          console.log("Showing reminder: Time threshold passed");
          setShowReminder(true);

          // Update last shown time
          await AsyncStorage.setItem(reminderKey, currentTime.toString());
        } else {
          console.log("Not showing reminder: Time threshold not passed");
        }
      } catch (error) {
        console.log("Error checking reminder status:", error);
        setShowReminder(true); // Show on error to be safe
      }
    };

    // Only check after splash screen is gone and auth and data are initialized
    if (!showSplash && authInitialized && dataInitialized) {
      console.log("Conditions met for checking reminder");
      checkReminderStatus();
    } else {
      console.log("Not checking reminder status:", {
        showSplash,
        authInitialized,
        dataInitialized,
      });
    }
  }, [showSplash, isAuthenticated, authInitialized, dataInitialized]);

  // Separate useEffect just for showing the reminder
  useEffect(() => {
    // Function to force show reminder after a short delay
    const forceShowReminder = () => {
      console.log("🔔 FORCE SHOWING REMINDER");
      setShowReminder(true);
    };

    // Only run this when user is authenticated and app is fully loaded
    if (isAuthenticated && !showSplash && authInitialized && dataInitialized) {
      // Show reminder after a short delay to ensure UI is stable
      const timer = setTimeout(forceShowReminder, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showSplash, authInitialized, dataInitialized]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleReminderDismiss = () => {
    setShowReminder(false);
  };

  // Show custom splash screen while loading
  if (showSplash) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading indicator while checking authentication or loading fonts
  if (!loaded || !authInitialized || !dataInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_bottom",
            animationDuration: 200,
            contentStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="verification" />
          <Stack.Screen name="full-name" />
          <Stack.Screen name="address" />
          <Stack.Screen name="profile" />
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
        {showReminder && isAuthenticated && (
          <CheckoutReminder onDismiss={handleReminderDismiss} />
        )}
      </ThemeProvider>
    </Provider>
  );
}
