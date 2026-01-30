import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const email = searchParams.get('email')

		if (!email) {
			return NextResponse.json(
				{ success: false, error: 'Email required' },
				{ status: 400 }
			)
		}

		const response = await fetch(
			`https://api.flutterwave.com/v3/transactions?customer_email=${email}`,
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
				transactions: data.data
			})
		}

		return NextResponse.json({
			success: true,
			transactions: []
		})
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
