import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  I18nManager,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/states/store";
import { useUser } from "@/hooks/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// Enable RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const { getUser } = useUser();
  const { data: userData } = useSelector((state: RootState) => state.user);
  const [localProfileImage, setLocalProfileImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.uid) {
        await getUser(currentUser.uid);
      }
    };
    loadUserData();
  }, [currentUser?.uid]);

  const loadLocalProfileImage = async () => {
    if (currentUser?.uid) {
      try {
        const savedImageUri = await AsyncStorage.getItem(
          `profile_image_${currentUser.uid}`
        );
        if (savedImageUri) {
          setLocalProfileImage(savedImageUri);
        }
      } catch (error) {
        console.error("Error loading profile image from storage:", error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        if (currentUser?.uid) {
          await getUser(currentUser.uid);
          await loadLocalProfileImage();
        }
      };
      refreshData();
    }, [currentUser?.uid])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: "person-outline",
      title: "تعديل الملف الشخصي",
      onPress: () => router.push("/profile-form"),
    },
    {
      icon: "time-outline",
      title: "سجل الطلبات",
      onPress: () => router.push("/orders"),
    },
    {
      icon: "notifications-outline",
      title: "الإشعارات",
      onPress: () => {},
    },
    {
      icon: "lock-closed-outline",
      title: "الخصوصية والأمان",
      onPress: () => {},
    },
    {
      icon: "help-circle-outline",
      title: "المساعدة والدعم",
      onPress: () => {},
    },
    {
      icon: "information-circle-outline",
      title: "حول التطبيق",
      onPress: () => {},
    },
  ];

  return (
    <LinearGradient
      colors={["#1a1a1a", "#2d2d2d"]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              {localProfileImage ? (
                <Image
                  source={{ uri: localProfileImage }}
                  style={styles.profileImage}
                />
              ) : userData?.image?.url ? (
                <Image
                  source={{
                    uri: process.env.EXPO_PUBLIC_BASE + userData.image.url,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.profileImage}
                />
              )}
            </View>
            <Text style={styles.name}>
              {userData?.full_name || "مستخدم جديد"}
            </Text>
            <Text style={styles.phone}>{currentUser?.phoneNumber}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>تم التحقق</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={24} color="#FF6B00" />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#FF6B00", "#FF8533"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signOutButtonGradient}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.signOutText}>تسجيل الخروج</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FF6B00",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: "#999",
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    color: "#4CAF50",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  menuContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  signOutButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signOutButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
