import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
	try {
		const { subscriptionId, flutterwaveTransactionId } =
			await request.json() // ✅ Renamed

		console.log('🚫 Cancelling subscription:', subscriptionId)

		// Get subscription details
		const { data: subscription, error } = await supabaseAdmin
			.from('subscriptions')
			.select('*')
			.eq('id', subscriptionId)
			.single()

		if (error || !subscription) {
			return NextResponse.json(
				{ error: 'Subscription not found' },
				{ status: 404 }
			)
		}

		// ✅ NOTE: Flutterwave doesn't have a separate "cancel subscription" API
		// Subscriptions are just payment plans + recurring charges
		// You can only stop future charges by marking as cancelled in your DB

		// Update subscription in database
		await supabaseAdmin
			.from('subscriptions')
			.update({
				cancel_at_period_end: true,
				cancelled_at: new Date().toISOString()
			})
			.eq('id', subscriptionId)

		console.log('✅ Subscription marked for cancellation')

		return NextResponse.json({
			success: true,
			message:
				'Subscription will be cancelled at the end of the billing period'
		})
	} catch (error) {
		console.error('❌ Cancellation error:', error)
		return NextResponse.json(
			{ error: 'Failed to cancel subscription' },
			{ status: 500 }
		)
	}
}
