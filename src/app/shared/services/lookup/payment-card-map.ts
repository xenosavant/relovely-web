export type PaymentCardType = 'mastercard' | 'amex' | 'visa' | 'discover' | 'diners_club' | 'jcb' | 'union_pay';

export const CARD_IMAGE_MAP: Record<string, string> = {
    ['amex']: 'women-clothing.svg',
    ['visa']: 'women-shoes.svg',
    ['discover']: 'women-handbags.svg',
    ['mastercard']: 'women-accessories.svg'
}

export const REVERSE_CARD_TYPE_MAP: Record<string, PaymentCardType> = {
    ['American Express']: 'amex',
    ['Visa']: 'visa',
    ['Visa (debit)']: 'visa',
    ['Discover']: 'discover',
    ['Mastercard']: 'mastercard',
    ['Mastercard (2-series)']: 'mastercard',
    ['Mastercard (debit)']: 'mastercard',
    ['JCB']: 'jcb',
    ['Diners Club']: 'diners_club',
    ['Diners Club (14 digit card)']: 'diners_club',
    ['UnionPay']: 'union_pay'
}

export const CARD_TYPE_MAP: Record<PaymentCardType, string> = {
    ['amex']: 'American Express',
    ['visa']: 'Visa',
    ['discover']: 'Discover',
    ['mastercard']: 'Mastercard',
    ['diners_club']: `Diner's club`,
    ['jcb']: 'JCB',
    ['union_pay']: 'Union Pay'
}