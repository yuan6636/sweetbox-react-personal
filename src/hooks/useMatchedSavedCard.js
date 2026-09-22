import { useMemo } from 'react';

// utils
import { getCardType } from '../utils/payment';

export function useMatchedSavedCard({ watch, savedCards }) {
  const [cardNumber, expiryMonth, expiryYear, cardOwner] = watch([
    'cardNumber',
    'expiryMonth',
    'expiryYear',
    'cardOwner',
  ]);

  const matchedSavedCard = useMemo(() => {
    // 確認付款資料是否填完
    if (!cardNumber || !expiryMonth || !expiryYear || !cardOwner) {
      return null;
    }

    // 已儲存的信用卡
    const storedCard = savedCards.find(
      (card) =>
        card.lastFour === cardNumber.slice(-4) &&
        card.expiryMonth === Number(expiryMonth) &&
        card.expiryYear === Number(expiryYear) &&
        card.cardOwner === cardOwner &&
        card.cardBrand === getCardType(cardNumber),
    );
    return storedCard ?? null;
  }, [cardNumber, expiryMonth, expiryYear, cardOwner, savedCards]);

  return matchedSavedCard;
}
