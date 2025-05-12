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
import {
  CartGetAction,
  CartPostActions,
  CartUpdateQuantityAction,
  CartDeleteItemAction,
} from "@/states/user/cart";
import { getAddress, postAddress } from "@/states/user/address";

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

  const { data: userAddress } = useSelector(
    (state: RootState) => state.userAddress
  );

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
      await dispatch(CartPostActions(data)).unwrap();
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const getCart = async () => {
    try {
      await dispatch(CartGetAction()).unwrap();
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateCartQuantity = async (
    cartItemId: string | number,
    quantity: number
  ) => {
    try {
      await dispatch(
        CartUpdateQuantityAction({ cartItemId, quantity })
      ).unwrap();
      await getCart();
      return true;
    } catch (error) {
      console.log("error updating cart quantity", error);
      return false;
    }
  };

  const deleteCartItem = async (cartItemId: string | number) => {
    try {
      await dispatch(CartDeleteItemAction(cartItemId)).unwrap();
      await getCart(); // Refresh cart after deletion
      return true;
    } catch (error) {
      console.log("error deleting cart item", error);
      return false;
    }
  };
  const postUserAddress = async (data: any) => {
    try {
      await dispatch(postAddress(data)).unwrap();
    } catch (error) {
      console.log("error posting address", error);
    }
  };

  const getUserAddress = async () => {
    try {
      await dispatch(getAddress()).unwrap();
    } catch (error) {
      console.log("error posting address", error);
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
    getCart,
    updateCartQuantity,
    deleteCartItem,
    postUserAddress,
    getUserAddress,
    userAddress,
  };
};
