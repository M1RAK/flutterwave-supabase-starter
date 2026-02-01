import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { extractRealEmail } from '@/lib/utils/email'

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

async function handleChargeCompleted(data: any) {
	console.log('💳 Processing charge:', data.id)

	// Extract real email for user lookup
	const realEmail = extractRealEmail(data.customer.email)
	console.log('📧 Original email (Flutterwave):', data.customer.email)
	console.log('📧 Extracted email (real):', realEmail)

	// Calculate next billing period
	const startDate = new Date()
	const endDate = new Date()

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

	// Find user by REAL email
	const { data: user } = await supabaseAdmin
		.from('users')
		.select('id')
		.eq('email', realEmail.toLowerCase())
		.maybeSingle()

	console.log(
		'👤 User lookup result:',
		user ? `Found: ${user.id}` : 'Not found'
	)

	const planId = data.plan?.toString() || ''
	console.log('📋 Plan ID:', planId)

	// UPSERT subscription
	const { data: subscription, error } = await supabaseAdmin
		.from('subscriptions')
		.upsert(
			{
				flutterwave_transaction_id: data.id.toString(),
				flutterwave_plan_id: planId,
				flutterwave_customer_id: data.customer.id?.toString(),
				customer_email: data.customer.email,
				user_id: user?.id || null,
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
		'✅ Subscription upserted:',
		subscription.id,
		'User:',
		user?.id,
		'Plan:',
		planId
	)
}

async function handleSubscriptionCancelled(data: any) {
	console.log('🚫 Cancelling subscription:', data.id)
	await supabaseAdmin
		.from('subscriptions')
		.update({
			status: 'cancelled',
			cancelled_at: new Date().toISOString()
		})
		.eq('flutterwave_transaction_id', data.id.toString())
}
