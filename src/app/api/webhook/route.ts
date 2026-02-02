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
	const metadata = event.meta_data

	console.log('💳 Processing charge:', data.id)
	console.log('📦 Metadata:', metadata)

	// ✅ PRIMARY: Get userId from metadata
	const userId = metadata?.userId
	console.log('👤 User ID from metadata:', userId)

	// Calculate billing period
	const startDate = new Date()
	const endDate = new Date()

	const interval = data.payment_plan?.interval || 'monthly'
	console.log('📅 Billing interval:', interval)

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

	// Get plan ID
	const planId = data.plan?.toString() || ''
	console.log('📋 Plan ID:', planId)

	// ✅ Upsert subscription with userId
	const { data: subscription, error } = await supabaseAdmin
		.from('subscriptions')
		.upsert(
			{
				flutterwave_transaction_id: data.id.toString(),
				flutterwave_plan_id: planId,
				flutterwave_customer_id: data.customer.id?.toString(),
				customer_email: data.customer.email, // Store Flutterwave's email
				user_id: userId || null, // ✅ Direct userId from metadata
				status: data.status === 'successful' ? 'active' : 'failed',
				current_period_start: startDate.toISOString(),
				current_period_end: endDate.toISOString()
			},
			{
				onConflict: 'flutterwave_transaction_id'
			}
		)
		.select()
		.single()

	if (error) {
		console.error('❌ Error upserting subscription:', error)
		return
	}

	console.log(
		'✅ Subscription created:',
		subscription.id,
		'User:',
		userId,
		'Plan:',
		planId
	)
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
