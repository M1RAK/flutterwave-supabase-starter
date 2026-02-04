import { useState, useEffect, useCallback } from 'react'
import { FlutterwavePlan } from '@/types/database'

interface Subscription {
	flutterwave_plan_id: string
}

export function usePlans() {
	const [plans, setPlans] = useState<FlutterwavePlan[]>([])
	const [loading, setLoading] = useState(true)

	const loadPlans = useCallback(async () => {
		try {
			const response = await fetch('/api/plans')
			const data = await response.json()

			if (data.success) {
				setPlans(data.plans)
			}
		} catch (error) {
			console.error('Error loading plans:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadPlans()
	}, [loadPlans])

	const getPlanById = (
		planId: string | number
	): FlutterwavePlan | undefined => {
		return plans.find((p) => p.id.toString() === planId.toString())
	}

	const getCurrentPlan = (
		subscription: Subscription | null
	): FlutterwavePlan | undefined => {
		if (!subscription) return undefined
		return getPlanById(subscription.flutterwave_plan_id)
	}

	return {
		plans,
		loading,
		getPlanById,
		getCurrentPlan,
		reloadPlans: loadPlans
	}
}
