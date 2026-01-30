import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ planId: string }> } // ✅ Changed to Promise
) {
	try {
		const { planId } = await params // ✅ Await params

		const response = await fetch(
			`https://api.flutterwave.com/v3/payment-plans/${planId}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
				}
			}
		)

		const data = await response.json()

		if (data.status === 'success') {
			return NextResponse.json({
				success: true,
				plan: data.data
			})
		}

		return NextResponse.json(
			{ success: false, error: 'Plan not found' },
			{ status: 404 }
		)
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
