export const STRIPE_MONTHLY_LINK = 'https://buy.stripe.com/6oU4gBaoO1WDc9f6vwcIE03';
export const STRIPE_LIFETIME_LINK = 'https://buy.stripe.com/cNi4gB0Oe1WD2yFaLMcIE02';

export function stripePaymentUrl(paymentLink: string, userId?: string | null): string | null {
  if (!userId) {
    return null;
  }

  return `${paymentLink}?client_reference_id=${encodeURIComponent(userId)}`;
}
