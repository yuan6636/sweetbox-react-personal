//------會員資訊區--------
// 信用卡效期
export const currentYear = new Date().getFullYear();
export const creditCardYears = Array.from({ length: 11 }, (_, i) => currentYear + i);
export const creditCardMonths = Array.from({ length: 12 }, (_, i) => i + 1);

// 發票類型
export const invoiceOpts = [
  { label: '不使用載具', value: 'na' },
  { label: '會員載具(自動儲存)', value: 'member' },
  { label: '手機條碼', value: 'mobile' },
  { label: '公司戶發票(開立抬頭)', value: 'business' },
  { label: '捐贈發票', value: 'donation' },
];
