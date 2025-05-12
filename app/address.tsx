import React, { useState } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomAlert from "./components/CustomAlert";
import { useUser } from "@/hooks/useUser";
import { postAddress } from "@/states/user/address";
import { useDispatch } from "react-redux";

const AddressScreen = () => {
  const { postUserAddress, user } = useUser();
  const { id } = user.data;
  console.log(id);
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const dispatch = useDispatch();

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

  const handleContinue = async () => {
    if (!address.trim()) {
      showAlert("خطأ", "الرجاء إدخال العنوان", "error");
      return;
    }
    if (!city.trim()) {
      showAlert("خطأ", "الرجاء إدخال المدينة", "error");
      return;
    }

    const information = {
      data: { home_address: address, city: city, customer: id },
    };
    postUserAddress(information);
    router.push({
      pathname: "/profile",
      params: {
        fullName: params.fullName,
        address,
        city,
      },
    });
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
              <Ionicons name="location" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>العنوان</Text>
            <Text style={styles.subtitle}>
              أدخل عنوانك ومدينتك لتسهيل عملية التسليم
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>العنوان</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="أدخل عنوانك"
              placeholderTextColor="#999"
              textAlign="right"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>المدينة</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="أدخل مدينتك"
              placeholderTextColor="#999"
              textAlign="right"
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
              <Text style={styles.continueButtonText}>متابعة</Text>
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
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
    marginTop: 20,
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

export default AddressScreen;
