/**
 * Get all addresses from the state
 * @param {import('../store').RootState} state
 * @returns {import('./types').Address[]}
 */
export const selectAddresses = (state) => state.address.addresses;

/**
 * Get the selected address ID
 * @param {import('../store').RootState} state
 * @returns {string|null}
 */
export const selectSelectedAddressId = (state) =>
  state.address.selectedAddressId;

/**
 * Get the selected address object
 * @param {import('../store').RootState} state
 * @returns {import('./types').Address|undefined}
 */
export const selectSelectedAddress = (state) => {
  const addresses = selectAddresses(state);
  const selectedId = selectSelectedAddressId(state);
  return addresses.find((address) => address.id === selectedId);
};
