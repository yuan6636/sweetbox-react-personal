export const stripNonDigits = (e) => {
  e.target.value = e.target.value.replace(/\D/g, '');
};
