import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../profile";
import { BlurView } from "expo-blur";
import CustomAlert from "../components/CustomAlert";
import { LinearGradient } from "expo-linear-gradient";

// Enable RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const { width } = Dimensions.get("window");

const BookingScreen = () => {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  console.log(code);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [alert, setAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });
  const inputRefs = React.useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

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

  // Handle the button press
  async function signInWithPhoneNumber() {
    if (!phoneNumber) {
      showAlert("خطأ", "الرجاء إدخال رقم الهاتف", "error");
      return;
    }

    setLoading(true);
    try {
      const formattedNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      setConfirm(confirmation);
    } catch (error: any) {
      console.log("Error sending code:", error);
      showAlert(
        "خطأ",
        error?.message ||
          "فشل في إرسال رمز التحقق. يرجى التحقق من رقم هاتفك والمحاولة مرة أخرى.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function confirmCode() {
    const verificationCode = [...code].reverse().join("");
    if (verificationCode.length !== 6) {
      showAlert("خطأ", "الرجاء إدخال جميع رموز التحقق", "error");
      return;
    }
    setLoading(true);

    try {
      const confirmationResult = await confirm?.confirm(verificationCode);
      if (confirmationResult) {
        const { additionalUserInfo, user } = confirmationResult;
        if (additionalUserInfo?.isNewUser) {
          router.push("/full-name");
        } else {
          router.push("/(tabs)/booking");
        }
      }
      showAlert("نجاح", "تم التحقق من رقم الهاتف بنجاح", "success");
    } catch (error: any) {
      showAlert("خطأ", "رمز التحقق غير صحيح", "error");
    } finally {
      setLoading(false);
    }
  }

  const renderPhoneInput = () => (
    <Animated.View style={[styles.container]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait" size={60} color="#fff" />
          </View>
          <Text style={styles.title}>أدخل رقم هاتفك</Text>
          <Text style={styles.subtitle}>
            سنرسل لك رمز التحقق للتحقق من رقم هاتفك
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <BlurView intensity={80} style={styles.inputWrapper}>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+966 50 000 0000"
              placeholderTextColor="#fff"
              keyboardType="phone-pad"
              style={styles.phoneInput}
              textAlign="center"
            />
          </BlurView>
        </View>

        <TouchableOpacity
          onPress={signInWithPhoneNumber}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <View style={styles.buttonContent}>
            {loading ? (
              <Text style={styles.buttonText}>جاري الإرسال...</Text>
            ) : (
              <Text style={styles.buttonText}>إرسال رمز التحقق</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderCodeInput = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={60} color="#fff" />
          </View>
          <Text style={styles.title}>التحقق</Text>
          <Text style={styles.subtitle}>
            أدخل رمز التحقق الذي أرسلناه إلى رقم هاتفك
          </Text>
        </View>

        <View style={styles.codeInputContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.codeDigitInput}
              maxLength={1}
              keyboardType="number-pad"
              value={code[index]}
              onChangeText={(text) => {
                if (text.length <= 1) {
                  const newCode = [...code];
                  newCode[index] = text;
                  setCode(newCode);

                  // Move to next input if a number was entered
                  if (text.length === 1 && index < 5) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                // Handle backspace
                if (
                  nativeEvent.key === "Backspace" &&
                  !code[index] &&
                  index > 0
                ) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={confirmCode}
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          disabled={loading || code.join("").length !== 6}
        >
          <LinearGradient
            colors={["#FF6B00", "#FF8533"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.verifyButtonGradient}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "جاري التحقق..." : "تحقق"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>لم تستلم الرمز؟</Text>
          <TouchableOpacity onPress={signInWithPhoneNumber}>
            <Text style={styles.resendText}>إعادة الإرسال</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  // Show profile screen if user is logged in, otherwise show login screen
  if (user) {
    return <ProfileScreen />;
  }
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          {!confirm ? renderPhoneInput() : renderCodeInput()}
        </KeyboardAvoidingView>
        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4c669f",
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4c669f",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 30,
    width: "100%",
  },
  inputWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  phoneInput: {
    height: 60,
    fontSize: 18,
    color: "#fff",
    paddingHorizontal: 20,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  codeDigitInput: {
    width: 45,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  verifyButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal: 20,
  },
  verifyButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#999",
    marginRight: 5,
  },
  resendText: {
    color: "#FF6B00",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 20,
    backgroundColor: "#FF8E42",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default BookingScreen;
