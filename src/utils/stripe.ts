export const STRIPE_MONTHLY_LINK = 'https://buy.stripe.com/6oU4gBaoO1WDc9f6vwcIE03';
export const STRIPE_LIFETIME_LINK = 'https://buy.stripe.com/cNi4gB0Oe1WD2yFaLMcIE02';

export function stripePaymentUrl(paymentLink: string, userId?: string | null): string | null {
  if (!userId) {
    return null;
  }

  return `${paymentLink}?client_reference_id=${encodeURIComponent(userId)}`;
}

export function parseSubscription(data: unknown): { hasSubscription: boolean; cancelsAt: string | null } {
  const records = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && 'subscription_status' in data
      ? [data]
      : [];

  const active = records.find(
    (record: any) => record && record.subscription_status === 'active'
  );

  if (!active) {
    return { hasSubscription: false, cancelsAt: null };
  }

  const cancelsAt = typeof active.cancels_at === 'string' && active.cancels_at ? active.cancels_at : null;
  return { hasSubscription: true, cancelsAt };
}

