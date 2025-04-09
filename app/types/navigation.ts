import { Address } from "../../states/address/types";

export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  ProductDetail: { slug: string };
  Cart: undefined;
  AddressList: { fromCheckout?: boolean };
  AddAddress: { address?: Address };
  Checkout: undefined;
  "/payment/payment": undefined;
  Confirmation: {
    orderNumber: string;
    total: string;
    paymentMethod: string;
    shippingAddress: string;
    estimatedDelivery: string;
  };
};
