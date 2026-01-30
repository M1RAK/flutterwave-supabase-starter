import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { extractRealEmail } from '@/lib/utils'

export async function POST(request: Request) {
	try {
		const { transactionId, planId, planToken } = await request.json()

		console.log('🔍 Verifying transaction:', transactionId)

		// Verify payment with Flutterwave
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

			const realEmail = extractRealEmail(paymentData.customer.email)
			console.log('📧 Original email:', paymentData.customer.email)
			console.log('📧 Extracted email:', realEmail)

			const { data: user } = await supabaseAdmin
				.from('users')
				.select('id')
				.eq('email', realEmail.toLowerCase())
				.maybeSingle()

			if (!user) {
				console.warn('⚠️ User not found for email:', realEmail)
				return NextResponse.json({
					success: true,
					message:
						'Payment verified. Subscription will be activated via webhook.'
				})
			}

			console.log('👤 User found:', user.id)

			const startDate = new Date()
			const endDate = new Date()

			// ✅ FIX: Get interval from meta or default
			const planInterval =
				paymentData.meta?.payment_plan_interval || 'monthly'
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

			// ✅ FIX: Use paymentData.plan (which is the number 228926)
			const resolvedPlanId =
				paymentData.plan?.toString() || planId.toString()
			console.log('📋 Plan ID from payment:', resolvedPlanId)

			const { data: subscription, error } = await supabaseAdmin
				.from('subscriptions')
				.upsert(
					{
						flutterwave_transaction_id: paymentData.id.toString(),
						flutterwave_plan_id: resolvedPlanId, // ✅ Fixed!
						flutterwave_customer_id:
							paymentData.customer.id?.toString(),
						customer_email: realEmail.toLowerCase(),
						user_id: user.id,
						status: 'active',
						current_period_start: startDate.toISOString(),
						current_period_end: endDate.toISOString(),
						cancel_at_period_end: false
					},
					{
						onConflict: 'flutterwave_transaction_id'
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
