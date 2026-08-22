/**
 * Shared geometry for the fixed mobile Create / Mine / Hub bar.
 * Action bars (save, publish) sit above this; content needs matching bottom pad.
 */
export const MOBILE_NAV_H = '3.75rem';

/** CSS length: tab bar height + iOS home indicator. */
export const ABOVE_MOBILE_NAV =
    `calc(${MOBILE_NAV_H} + env(safe-area-inset-bottom, 0px))` as const;
