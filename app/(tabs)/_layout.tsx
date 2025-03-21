import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import CurvedTabBarBackground from "@/components/CurvedTabBar";
import "react-native-gesture-handler";
import {
  LucideHome,
  LucideShoppingCart,
  LucideCalendar,
  LucideLayoutGrid,
  LucidePi,
  TabletSmartphone,
  User,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: Colors.dark.price,
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarStyle: {
          top: "90%",
          marginHorizontal: 2,
          height: 70,
          position: "absolute", // Ensure transparency by making it float
          backgroundColor: Colors.light.tabBar,
          borderRadius: 30, // Fully transparent
          borderTopWidth: 0, // Remove any top border
          elevation: 2, // Remove shadow on Android
          shadowOpacity: 3, // Remove shadow on iOS
          zIndex: 9999999,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, focused }) => (
            <LucideHome size={24} color={color} />
          ),
        }}
      />

      {/* Categories */}
      <Tabs.Screen
        name="categories"
        options={{
          title: "الفئات",
          tabBarIcon: ({ color, focused }) => (
            <LucideLayoutGrid
              size={24}
              fill={focused ? color : "none"}
              color={color}
            />
          ),
        }}
      />

      {/* Center Cart Button (Floating Circular Design) */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: Colors.dark.blue,
                width: 65,
                height: 65,
                borderRadius: 32.5,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30, // Lift it up
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 6, // For Android shadow
              }}
            >
              <LucideShoppingCart
                size={30}
                fill={focused ? color : "none"}
                color={focused ? color : "white"}
              />
            </View>
          ),
        }}
      />

      {/* Services */}
      <Tabs.Screen
        name="products"
        options={{
          title: "منتجات",
          tabBarIcon: ({ color, focused }) => (
            <TabletSmartphone
              size={24}
              fill={focused ? color : "none"}
              color={color}
            />
          ),
        }}
      />

      {/* Booking */}
      <Tabs.Screen
        name="booking"
        options={{
          title: "حساب",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
