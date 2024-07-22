// * Capitalizes the first letter of each word in a string.
export const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Formats a number as Nigerian Naira currency.
export const formatNaira = (amount) => {
  // Check if amount is a valid number

  if (amount == null || isNaN(amount)) {
    return '₦0'
  }
  return '₦' + Number(amount).toLocaleString()
}
