/**
 * Check if we're in test/sandbox mode
 */
export function isTestMode(): boolean {
	return process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes('TEST') || false
}

/**
 * Extract real email from Flutterwave sandbox prefix
 * Example: ravesb_xxx_user@gmail.com → user@gmail.com
 */
export function extractRealEmail(flutterwaveEmail: string): string {
	const match = flutterwaveEmail.match(/_([^_@]+@.+)$/)
	return match ? match[1] : flutterwaveEmail
}

/**
 * Get the email format that Flutterwave uses in their API
 * - Test mode: Returns email WITH sandbox prefix (for API calls)
 * - Live mode: Returns email as-is
 */
export function getFlutterwaveEmail(realEmail: string): string {
	// In live mode, email stays the same
	if (!isTestMode()) {
		return realEmail
	}

	// In test mode, check if email already has prefix
	if (realEmail.includes('ravesb_')) {
		return realEmail // Already has prefix
	}

	// We can't reconstruct the exact prefix Flutterwave uses
	// So in test mode, we need to get it from the subscription record
	return realEmail
}

/**
 * Get Flutterwave email from subscription data
 * Use this when you need to call Flutterwave API
 */
export function getFlutterwaveEmailFromSubscription(
	subscription: { customer_email: string } | null,
	fallbackEmail: string
): string {
	// If we have subscription, use the email Flutterwave knows
	if (subscription?.customer_email) {
		return subscription.customer_email
	}

	// Otherwise use the fallback
	return fallbackEmail
}
