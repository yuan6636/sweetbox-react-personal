// 格式化卡號
export const formatCardNumber = (value) => {
  const numbers = value.replace(/\D/g, '').slice(0, 16);
  const groups = numbers.match(/.{1,4}/g);
  return groups ? groups.join('-') : '';
};

// 判斷信用卡類型
export const getCardType = (number) => {
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^35/.test(number)) return 'jcb';
  return 'visa';
};

export const formatToUpperCase = (name) => {
  return name?.toUpperCase() ?? '';
};

// 格式化信用卡效期
export const formatExpiryDate = (month, year) => {
  if (!month || !year) return '';

  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
};

// 判斷信用卡是否過期
export const isCardExpired = (expiryYear, expiryMonth) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() 從 0 開始，轉成 1-based month 與 creditCardMonths 對齊

  if (currentYear > Number(expiryYear)) return true;
  if (currentYear === Number(expiryYear) && currentMonth > Number(expiryMonth)) return true;

  return false;
};
