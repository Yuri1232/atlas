export const ADDRESS_TYPES = {
  ADD_ADDRESS: "address/addAddress",
  UPDATE_ADDRESS: "address/updateAddress",
  DELETE_ADDRESS: "address/deleteAddress",
  SET_SELECTED_ADDRESS: "address/setSelectedAddress",
};

/**
 * @typedef {Object} Address
 * @property {string} id - Unique identifier for the address
 * @property {string} name - Name associated with the address
 * @property {string} street - Street address
 * @property {string} city - City name
 * @property {string} state - State or region
 * @property {string} country - Country name
 * @property {string} [phoneNumber] - Optional phone number
 */

/**
 * @typedef {Object} AddressState
 * @property {Address[]} addresses - Array of addresses
 * @property {string|null} selectedAddressId - ID of the selected address
 */
