import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

export function useAuthCheck() {
  const router = useRouter();

  const checkAuth = () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert(
        "تسجيل الدخول مطلوب",
        "يجب تسجيل الدخول لإضافة منتجات إلى السلة",
        [
          {
            text: "إلغاء",
            style: "cancel",
          },
          {
            text: "تسجيل الدخول",
            onPress: () => router.push("/(tabs)/booking"),
          },
        ]
      );
      return false;
    }
    return true;
  };

  return { checkAuth };
}
