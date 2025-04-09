import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import "react-native-gesture-handler";
import "react-native-reanimated";
import {
  LucideHome,
  LucideShoppingCart,
  LucideLayoutGrid,
  TabletSmartphone,
  User,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import QuantityCounter from "@/components/modal/QuantityCounter";
import { useSelector } from "react-redux";

export default function TabLayout() {
  const { data } = useSelector((state: any) => state.cart);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.blue,
        tabBarInactiveTintColor: "#94A3B8",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 65,
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "white",
          borderRadius: 32,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          borderTopWidth: 0,
          paddingBottom: 0,
          paddingHorizontal: 16,
        },
        tabBarItemStyle: {
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Medium",
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, focused }) => (
            <LucideHome
              size={22}
              color={color}
              fill={focused ? color : "transparent"}
              strokeWidth={focused ? 1.5 : 1.5}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "الفئات",
          tabBarIcon: ({ color, focused }) => (
            <LucideLayoutGrid
              size={22}
              color={color}
              fill={focused ? color : "transparent"}
              strokeWidth={focused ? 1.5 : 1.5}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: Colors.dark.blue,
                width: 56,
                height: 56,
                borderRadius: 28,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 32,
                shadowColor: Colors.dark.blue,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <QuantityCounter size={18}>{data.length}</QuantityCounter>
              <LucideShoppingCart size={26} color="white" strokeWidth={1.5} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: "منتجات",
          tabBarIcon: ({ color, focused }) => (
            <TabletSmartphone
              size={22}
              color={color}
              fill={focused ? color : "transparent"}
              strokeWidth={focused ? 1.5 : 1.5}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="booking"
        options={{
          title: "حساب",
          tabBarIcon: ({ color, focused }) => (
            <User
              size={22}
              color={color}
              fill={focused ? color : "transparent"}
              strokeWidth={focused ? 1.5 : 1.5}
            />
          ),
        }}
      />
    </Tabs>
  );
}
