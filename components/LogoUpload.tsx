import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ThemedText } from "./ThemedText";
import * as ImagePicker from "expo-image-picker";
import { useLogo } from "@/hooks/useLogo";
import styled from "styled-components/native";

const Container = styled(View)`
  padding: 20px;
`;

const UploadButton = styled(TouchableOpacity)`
  background-color: #0066ff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const ErrorText = styled(ThemedText)`
  color: #ff3b30;
  margin-top: 8px;
`;

const LogoUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { uploadLogo, isLoading, error } = useLogo();

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);

        const logoData = {
          title: "ATLAS",
          arabicText: "شركة اطلس",
          colors: {
            pin: "#FFD700",
            text: "#00CED1",
            globe: "#00CED1",
          },
          dimensions: {
            width: 800,
            height: 400,
          },
          isActive: true,
        };

        await uploadLogo(logoData, result.assets[0].uri);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
  };

  return (
    <Container>
      <UploadButton onPress={handleImagePick} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={{ color: "white", fontSize: 16 }}>
            Upload Logo
          </ThemedText>
        )}
      </UploadButton>

      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default LogoUpload;
