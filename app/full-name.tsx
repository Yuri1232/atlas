import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomAlert from "./components/CustomAlert";
import { useUser } from "@/hooks/useUser";
import auth from "@react-native-firebase/auth";
import { Loader } from "lucide-react-native";

const FullNameScreen = () => {
  const { createUser, modifyUser, user, getUser } = useUser();
  const { slug } = user.data.attributes;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const currentUser = auth().currentUser;

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
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

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setAlert({
      visible: true,
      title,
      message,
      type,
    });
  };

  const handleContinue = () => {
    setLoading(true);
    if (!fullName.trim()) {
      showAlert("خطأ", "الرجاء إدخال الاسم الكامل", "error");
      return;
    } else {
      if (!slug) {
        createUser({
          data: {
            slug: currentUser?.uid,
            full_name: fullName,
            phone_number: currentUser?.phoneNumber,
          },
        });
        router.push({
          pathname: "/address",
          params: { fullName },
        });
      } else {
        try {
          modifyUser(slug, { data: { full_name: fullName } });
          router.push({
            pathname: "/(tabs)/booking",
          });
        } catch (error) {
          return error;
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1a1a1a", "#2d2d2d"]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>الاسم الكامل</Text>
            <Text style={styles.subtitle}>
              أدخل اسمك الكامل كما تريد أن يظهر في ملفك الشخصي
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="أدخل اسمك الكامل"
              placeholderTextColor="#999"
              textAlign="right"
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={["#FF6B00", "#FF8533"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>
                {loading ? <Loader color={"#fff"} /> : "متابعة"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    height: 60,
    paddingHorizontal: 20,
    color: "#fff",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  continueButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FullNameScreen;
