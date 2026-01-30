import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const response = await fetch(
			'https://api.flutterwave.com/v3/payment-plans',
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
				}
			}
		)

		const data = await response.json()

		if (data.status === 'success') {
			// Filter active plans only
			const activePlans = data.data.filter(
				(plan: any) => plan.status === 'active'
			)

			return NextResponse.json({
				success: true,
				plans: activePlans
			})
		}

		return NextResponse.json(
			{ success: false, error: 'Failed to fetch plans' },
			{ status: 500 }
		)
	} catch (error) {
		console.error('Error fetching plans:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
