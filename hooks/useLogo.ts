import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/states/store";
import { postLogo, resetLogoState } from "@/states/logo/logoSlice";

export const useLogo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.logo
  );

  const uploadLogo = async (logoData: any, imageUri: string) => {
    try {
      // Create FormData
      const formData = new FormData();

      // Add the image file
      formData.append("files.image", {
        uri: imageUri,
        name: "logo.png",
        type: "image/png",
      } as any);

      // Add other logo data
      Object.keys(logoData).forEach((key) => {
        if (typeof logoData[key] === "object") {
          formData.append(`data.${key}`, JSON.stringify(logoData[key]));
        } else {
          formData.append(`data.${key}`, logoData[key]);
        }
      });

      // Dispatch the post action
      const result = await dispatch(postLogo(formData)).unwrap();
      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to upload logo");
    }
  };

  const resetLogo = () => {
    dispatch(resetLogoState());
  };

  return {
    logoData: data,
    isLoading: loading,
    error,
    uploadLogo,
    resetLogo,
  };
};
