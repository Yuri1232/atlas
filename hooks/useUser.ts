import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/states/store";
import { AppDispatch } from "@/states/store";
import {
  postUser,
  updateUser,
  getCustomer,
  resetUserState,
  uploadImage,
} from "@/states/user/user";
import { CartActions } from "@/states/user/cart";

export interface UserData {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  logo?: string;
}

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data,
    loading,
    error,
    updateStatus,
    updateError,
    uploadStatus,
    uploadError,
    uploadedImageUrl,
  } = useSelector((state: RootState) => state.user);

  const getUser = async (userId: string) => {
    try {
      await dispatch(getCustomer(userId)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const uploadUserImage = async (formData: FormData) => {
    try {
      await dispatch(uploadImage(formData)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const createUser = async (formData: FormData) => {
    try {
      await dispatch(postUser(formData)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const modifyUser = async (userId: string, userData: Partial<UserData>) => {
    try {
      await dispatch(
        updateUser({
          userId,
          userData,
        })
      ).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const resetUser = () => {
    dispatch(resetUserState());
  };

  const postCart = async (data: any) => {
    try {
      await dispatch(CartActions(data)).unwrap();
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  return {
    user: data,
    loading,
    error,
    updateStatus,
    updateError,
    uploadStatus,
    uploadError,
    uploadedImageUrl,
    getUser,
    uploadUserImage,
    createUser,
    modifyUser,
    resetUser,
    postCart,
  };
};
