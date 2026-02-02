/**
 * Check if we're in test/sandbox mode
 */
export function isTestMode(): boolean {
	return process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes('TEST') || false
}
