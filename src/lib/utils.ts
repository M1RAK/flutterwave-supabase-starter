// Utility function for environment detection
export const isTestMode = () => {
	return process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes('TEST') || false
}

export const getEnvironmentBadge = () => {
	return isTestMode() ? 'Test Mode' : 'Live Mode'
}

// ✅ Helper function to extract real email
export function extractRealEmail(flutterwaveEmail: string): string {
	  const match = flutterwaveEmail.match(/_([^_@]+@.+)$/)
		return match ? match[1] : flutterwaveEmail
}
