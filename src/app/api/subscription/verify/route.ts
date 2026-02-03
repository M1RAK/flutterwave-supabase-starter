import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
	try {
		const { transactionId, planId } = await request.json()

		console.log('🔍 Verifying transaction:', transactionId)

		const response = await fetch(
			`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
				}
			}
		)

		const data = await response.json()

		if (data.status === 'success' && data.data.status === 'successful') {
			const paymentData = data.data
			console.log('✅ Payment verified:', paymentData.id)

			// ✅ Get userId from meta (transaction verify DOES include meta)
			const userId = paymentData.meta?.userId
			console.log('👤 User ID from meta:', userId)

			if (!userId) {
				console.warn('⚠️ No userId in transaction metadata')
				return NextResponse.json({
					success: true,
					message:
						'Payment verified. Subscription will be activated via webhook.'
				})
			}

			console.log('👤 User ID confirmed:', userId)

			// Calculate subscription period
			const startDate = new Date()
			const endDate = new Date()

			const planInterval = paymentData.payment_plan?.interval || 'monthly'
			console.log('📅 Billing interval:', planInterval)

			switch (planInterval) {
				case 'daily':
					endDate.setDate(endDate.getDate() + 1)
					break
				case 'weekly':
					endDate.setDate(endDate.getDate() + 7)
					break
				case 'monthly':
					endDate.setMonth(endDate.getMonth() + 1)
					break
				case 'yearly':
					endDate.setFullYear(endDate.getFullYear() + 1)
					break
			}

			const resolvedPlanId =
				paymentData.plan?.toString() || planId.toString()
			console.log('📋 Plan ID:', resolvedPlanId)

			const { data: subscription, error } = await supabaseAdmin
				.from('subscriptions')
				.upsert(
					{
						user_id: userId, // ✅ Conflict key
						flutterwave_transaction_id: paymentData.id.toString(),
						flutterwave_plan_id: resolvedPlanId,
						flutterwave_customer_id:
							paymentData.customer.id?.toString(),
						customer_email: paymentData.customer.email,
						status: 'active',
						current_period_start: startDate.toISOString(),
						current_period_end: endDate.toISOString(),
						cancel_at_period_end: false
					},
					{
						onConflict: 'user_id', // ✅ One per user
						ignoreDuplicates: false
					}
				)
				.select()
				.single()

			if (error) {
				console.error('❌ Database error:', error)
				return NextResponse.json(
					{ error: 'Failed to create subscription' },
					{ status: 500 }
				)
			}

			console.log('✅ Subscription created/updated:', subscription.id)

			return NextResponse.json({
				success: true,
				subscription
			})
		}

		console.error('❌ Payment verification failed:', data)
		return NextResponse.json(
			{
				success: false,
				message: 'Payment verification failed'
			},
			{ status: 400 }
		)
	} catch (error) {
		console.error('❌ Verification error:', error)
		return NextResponse.json(
			{ error: 'Verification failed' },
			{ status: 500 }
		)
	}
}
