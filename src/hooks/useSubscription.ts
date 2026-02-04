import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
	FlutterwavePlan,
	FlutterwaveTransaction,
	Subscription
} from '@/types/database'

export function useSubscription(userId: string | undefined) {
	const [subscription, setSubscription] = useState<Subscription | null>(null)
	const [planDetails, setPlanDetails] = useState<FlutterwavePlan | null>(null)
	const [transactions, setTransactions] = useState<FlutterwaveTransaction[]>(
		[]
	)
	const [loading, setLoading] = useState(true)
	const [cancelling, setCancelling] = useState(false)

	const supabase = useMemo(() => createClient(), [])

	const loadSubscription = useCallback(async () => {
		if (!userId) {
			setLoading(false)
			return
		}

		try {
			// Fetch active subscription
			const { data: sub } = await supabase
				.from('subscriptions')
				.select('*')
				.eq('user_id', userId)
				.in('status', ['active', 'pending'])
				.order('created_at', { ascending: false })
				.limit(1)
				.maybeSingle()

			setSubscription(sub)

			if (sub) {
				// Fetch plan details
				const planResponse = await fetch(
					`/api/plans/${sub.flutterwave_plan_id}`
				)
				const planData = await planResponse.json()

				if (planData.success) {
					setPlanDetails(planData.plan)
				}

				// Fetch transaction history
				const txResponse = await fetch(
					`/api/transactions?email=${encodeURIComponent(
						sub.customer_email
					)}`
				)
				const txData = await txResponse.json()

				if (txData.success) {
					const userTx = txData.transactions.filter(
						(tx: FlutterwaveTransaction) =>
							tx.meta?.userId === userId
					)
					setTransactions(userTx)
				}
			}

			setLoading(false)
		} catch (error) {
			console.error('Error loading subscription:', error)
			setLoading(false)
		}
	}, [userId])

	const cancelSubscription = async () => {
		if (!subscription) return false

		const confirmed = window.confirm(
			'Are you sure you want to cancel your subscription?'
		)

		if (!confirmed) return false

		setCancelling(true)

		try {
			const response = await fetch('/api/subscription/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subscriptionId: subscription.id,
					flutterwaveTransactionId:
						subscription.flutterwave_transaction_id
				})
			})

			const data = await response.json()

			if (data.success) {
				await loadSubscription() // Reload subscription data
				return true
			} else {
				alert('Failed to cancel: ' + data.error)
				return false
			}
		} catch (error) {
			console.error('Error cancelling subscription:', error)
			alert('Failed to cancel subscription')
			return false
		} finally {
			setCancelling(false)
		}
	}

	useEffect(() => {
		loadSubscription()
	}, [loadSubscription])

	return {
		subscription,
		planDetails,
		transactions,
		loading,
		cancelling,
		hasActiveSubscription: !!subscription,
		cancelSubscription,
		reloadSubscription: loadSubscription
	}
}
