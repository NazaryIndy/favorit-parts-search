export const normalizeNumber = (number) => number.trim().toLowerCase();

export const getOffersKey = (number, brand) =>
  `${normalizeNumber(number)}::${brand.trim().toLowerCase()}`;
