import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
	try {
		const { subscriptionId } = await request.json()

		console.log('🚫 Cancelling subscription:', subscriptionId)

		// ✅ STEP 1: Get subscription details from database
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

		// ✅ STEP 2: Cancel subscription in Flutterwave
		// IMPORTANT: You need to store flutterwave_subscription_id in your database
		const flwSubscriptionId = subscription.flutterwave_subscription_id

		if (!flwSubscriptionId) {
			console.error('❌ Missing Flutterwave subscription ID')
			return NextResponse.json(
				{
					error: 'Flutterwave subscription ID not found',
					hint: 'This subscription may have been created before the fix. Please contact support.'
				},
				{ status: 400 }
			)
		}

		try {
			// Call Flutterwave's cancellation API
			const flutterwaveResponse = await fetch(
				`https://api.flutterwave.com/v3/subscriptions/${flwSubscriptionId}/cancel`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
						'Content-Type': 'application/json'
					}
				}
			)

			const flwData = await flutterwaveResponse.json()

			console.log('📡 Flutterwave response:', flwData)

			// Check if Flutterwave cancellation was successful
			if (flwData.status !== 'success') {
				console.error('❌ Flutterwave cancellation failed:', flwData)

				// If subscription is already cancelled in Flutterwave, that's OK
				if (
					flwData.message?.includes('already cancelled') ||
					flwData.message?.includes('not found')
				) {
					console.log(
						'⚠️ Subscription already cancelled in Flutterwave'
					)
				} else {
					return NextResponse.json(
						{
							error: 'Failed to cancel with Flutterwave',
							details: flwData.message
						},
						{ status: 500 }
					)
				}
			} else {
				console.log(
					'✅ Flutterwave subscription cancelled successfully'
				)
			}
		} catch (flwError) {
			console.error('❌ Error calling Flutterwave API:', flwError)
			return NextResponse.json(
				{ error: 'Failed to communicate with Flutterwave' },
				{ status: 500 }
			)
		}

		// ✅ STEP 3: Update subscription in YOUR database
		const { error: updateError } = await supabaseAdmin
			.from('subscriptions')
			.update({
				status: 'cancelled',
				cancel_at_period_end: true,
				cancelled_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', subscriptionId)

		if (updateError) {
			console.error('❌ Database update error:', updateError)
			return NextResponse.json(
				{ error: 'Failed to update database' },
				{ status: 500 }
			)
		}

		console.log(
			'✅ Subscription cancelled successfully in both Flutterwave and database'
		)

		return NextResponse.json({
			success: true,
			message:
				'Subscription cancelled successfully. You will not be charged again.'
		})
	} catch (error) {
		console.error('❌ Cancellation error:', error)
		return NextResponse.json(
			{ error: 'Failed to cancel subscription' },
			{ status: 500 }
		)
	}
}
