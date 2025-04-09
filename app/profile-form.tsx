import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import CustomAlert from "./components/CustomAlert";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { postUser, updateUser } from "@/states/user/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/states/store";
import { AppDispatch } from "@/states/store";
import { useUser } from "@/hooks/useUser";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserData {
  full_name: string;
  Email: string;
  address: string;
  city: string;
  image?: string;
}

interface ImageFile {
  uri: string;
  name: string;
  type: string;
  refId?: number;
  ref?: string;
  field?: string;
}

const ProfileForm = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const dispatch = useDispatch<AppDispatch>();
  const { getUser, uploadUserImage } = useUser();
  const {
    data: existingUserData,
    loading,
    error,
    updateStatus,
    uploadedImageUrl,
  } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<UserData>({
    full_name: "",
    Email: "",
    address: "",
    city: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  // Load existing user data if available
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.uid) {
        await getUser(currentUser.uid);
      }
    };
    loadUserData();
  }, [currentUser?.uid]);

  // Load profile image from local storage
  useEffect(() => {
    const loadProfileImage = async () => {
      if (currentUser?.uid) {
        try {
          const savedImageUri = await AsyncStorage.getItem(
            `profile_image_${currentUser.uid}`
          );
          if (savedImageUri) {
            setProfileImage(savedImageUri);
          }
        } catch (error) {
          console.error("Error loading profile image from storage:", error);
        }
      }
    };

    loadProfileImage();
  }, [currentUser?.uid]);

  // Update form data when existing user data changes
  useEffect(() => {
    if (existingUserData) {
      setFormData({
        full_name: existingUserData.full_name || "",
        Email: existingUserData.Email || "",
        address: existingUserData.address || "",
        city: existingUserData.city || "",
      });
      if (existingUserData.image?.url) {
        setProfileImage(existingUserData.image.url);
      }
    }
  }, [existingUserData]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showAlert(
          "خطأ",
          "نحتاج إلى إذن للوصول إلى معرض الصور الخاص بك",
          "error"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: false,
        exif: false,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];

        // Resize and compress the image
        const manipResult = await ImageManipulator.manipulateAsync(
          selectedImage.uri,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        setProfileImage(manipResult.uri);

        // Save the image URI to local storage
        if (currentUser?.uid) {
          await AsyncStorage.setItem(
            `profile_image_${currentUser.uid}`,
            manipResult.uri
          );
        }
      }
    } catch (error) {
      showAlert("خطأ", "حدث خطأ أثناء اختيار الصورة", "error");
    }
  };

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

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      showAlert("خطأ", "يرجى إدخال الاسم الكامل", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Prepare user data
      const userData = {
        data: {
          slug: currentUser?.uid,
          phone_number: currentUser?.phoneNumber,
          full_name: formData.full_name,
          Email: formData.Email,
          address: formData.address,
          city: formData.city,
        },
      };

      // Update or create user
      if (existingUserData) {
        await dispatch(
          updateUser({
            userId: currentUser?.uid || "",
            userData,
          })
        ).unwrap();
      } else {
        await dispatch(postUser(userData)).unwrap();
      }

      showAlert("نجاح", "تم حفظ معلوماتك بنجاح", "success");
      setTimeout(() => {
        router.push("/(tabs)/booking");
      }, 800);
    } catch (error: any) {
      showAlert("خطأ", error.message || "حدث خطأ أثناء حفظ المعلومات", "error");
    }
  };
  console.log(profileImage);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage.startsWith("/")
                      ? process.env.EXPO_PUBLIC_BASE + profileImage
                      : profileImage,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="camera" size={40} color="#fff" />
                  <Text style={styles.placeholderText}>اختر صورة</Text>
                </View>
              )}
              <View style={styles.editIconContainer}>
                <Ionicons name="pencil" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.title}>
              {existingUserData ? "تعديل الملف الشخصي" : "أكمل ملفك الشخصي"}
            </Text>
            <Text style={styles.subtitle}>يرجى ملء المعلومات التالية</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>رقم الهاتف</Text>
              <View style={[styles.input, styles.readOnlyInput]}>
                <Text style={styles.readOnlyText}>
                  {currentUser?.phoneNumber || ""}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.verifiedText}>تم التحقق</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>الاسم الكامل *</Text>
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(text) =>
                  setFormData({ ...formData, full_name: text })
                }
                placeholder="أدخل اسمك الكامل"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <TextInput
                style={styles.input}
                value={formData.Email}
                onChangeText={(text) =>
                  setFormData({ ...formData, Email: text })
                }
                placeholder="أدخل بريدك الإلكتروني (اختياري)"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>العنوان</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) =>
                  setFormData({ ...formData, address: text })
                }
                placeholder="أدخل عنوانك"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>المدينة</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) =>
                  setFormData({ ...formData, city: text })
                }
                placeholder="أدخل مدينتك"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (loading || updateStatus === "loading") &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading || updateStatus === "loading"}
            >
              {loading || updateStatus === "loading" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {existingUserData ? "حفظ التغييرات" : "حفظ المعلومات"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4c669f",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    marginTop: 5,
    fontSize: 14,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF8E42",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  form: {
    padding: 20,
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
    height: 50,
    paddingHorizontal: 15,
    color: "#fff",
    fontSize: 16,
  },
  readOnlyInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  readOnlyText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 14,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#FF8E42",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileForm;
