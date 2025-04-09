import React from "react";
import { useLocalSearchParams } from "expo-router";
import AddressForm from "../address/address";

export default function AddAddressModal() {
  const { address } = useLocalSearchParams<{ address?: string }>();
  const parsedAddress = address ? JSON.parse(address) : undefined;

  return <AddressForm address={parsedAddress} />;
}
