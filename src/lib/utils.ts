// ✅ Helper function to extract real email
export function extractRealEmail(flutterwaveEmail: string): string {
	const match = flutterwaveEmail.match(/_([^_@]+@.+)$/)
	if (match) {
		return match[1]
	}
	return flutterwaveEmail
}
