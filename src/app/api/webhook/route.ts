import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
	try {
		const payload = await request.text()
		const signature = request.headers.get('verif-hash')

		// Verify webhook signature
		if (!signature || signature !== process.env.FLW_SECRET_HASH) {
			console.error('❌ Invalid webhook signature')
			return NextResponse.json(
				{ error: 'Invalid signature' },
				{ status: 401 }
			)
		}

		const event = JSON.parse(payload)
		console.log('📥 Webhook event:', event, 'ID:', event.data.id)

		switch (event.event) {
			case 'charge.completed':
				await handleChargeCompleted(event.data)
				break

			case 'subscription.cancelled':
				await handleSubscriptionCancelled(event.data)
				break
		}

		return NextResponse.json({ status: 'success' })
	} catch (error) {
		console.error('❌ Webhook error:', error)
		return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
	}
}

async function handleChargeCompleted(event: any) {
	const data = event.data
	const metadata = event.meta_data // ✅ Access metadata correctly

	console.log('💳 Processing charge:', data.id)

	const userId = metadata?.userId
	console.log('👤 User ID from metadata:', userId)

	if (!userId) {
		console.error('❌ No userId in metadata - cannot link subscription')
		return
	}

	const startDate = new Date()
	const endDate = new Date()

	// ✅ Get interval from payment_plan if available, default to monthly
	const interval = data.payment_plan?.interval || 'monthly'

	switch (interval) {
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

	// ✅ FIX: Get plan ID from metadata, not from data.plan
	const planId = metadata?.plan_id?.toString() || ''
	console.log('📋 Plan ID from metadata:', planId)

	const { data: subscription, error } = await supabaseAdmin
		.from('subscriptions')
		.upsert(
			{
				user_id: userId,
				flutterwave_transaction_id: data.id.toString(),
				flutterwave_plan_id: planId,
				flutterwave_customer_id: data.customer.id?.toString(),
				customer_email: data.customer.email,
				status: data.status === 'successful' ? 'active' : 'failed',
				current_period_start: startDate.toISOString(),
				current_period_end: endDate.toISOString(),
				cancel_at_period_end: false
			},
			{
				onConflict: 'user_id',
				ignoreDuplicates: false
			}
		)
		.select()
		.single()

	if (error) {
		console.error('❌ Error upserting subscription:', error)
		return
	}

	console.log('✅ Subscription upserted for user:', userId, 'Plan:', planId)
}

async function handleSubscriptionCancelled(event: any) {
	const data = event.data

	console.log('🚫 Cancelling subscription:', data.id)

	await supabaseAdmin
		.from('subscriptions')
		.update({
			status: 'cancelled',
			cancelled_at: new Date().toISOString()
		})
		.eq('flutterwave_transaction_id', data.id.toString())
}
