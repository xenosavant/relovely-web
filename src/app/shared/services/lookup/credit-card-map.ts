export const CARD_IMAGE_MAP: Record<string, string> = {
    ['amex']: 'women-clothing.svg',
    ['visa']: 'women-shoes.svg',
    ['discover']: 'women-handbags.svg',
    ['mastercard']: 'women-accessories.svg'
}

export const REVERSE_CARD_TYPE_MAP: Record<string, 'mastercard' | 'amex' | 'visa' | 'discover'> = {
    ['American Express']: 'amex',
    ['Visa']: 'visa',
    ['Discover']: 'discover',
    ['Mastercard']: 'mastercard'
}

export const CARD_TYPE_MAP: Record<'mastercard' | 'amex' | 'visa' | 'discover', string> = {
    ['amex']: 'American Express',
    ['visa']: 'Visa',
    ['discover']: 'Discover',
    ['mastercard']: 'Mastercard'
}