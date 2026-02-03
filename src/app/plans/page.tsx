'use client'

import { useState, useEffect } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { createClient } from '@/lib/supabase/client'
import type { Subscription, FlutterwavePlan } from '@/types/database'

export default function SubscriptionPage() {
	const [plans, setPlans] = useState<FlutterwavePlan[]>([])
	const [currentSubscription, setCurrentSubscription] =
		useState<Subscription | null>(null)
	const [user, setUser] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const supabase = createClient()

	useEffect(() => {
		loadUserData()
		loadPlans()
	}, [])

	const loadUserData = async () => {
		try {
			const {
				data: { user: authUser }
			} = await supabase.auth.getUser()

			if (!authUser) {
				setLoading(false)
				return
			}

			setUser(authUser)

			// Get or create user profile
			const { data: profile } = await supabase
				.from('users')
				.select('*')
				.eq('id', authUser.id)
				.single()

			if (!profile) {
				await supabase.from('users').insert({
					id: authUser.id,
					email: authUser.email!,
					full_name: authUser.user_metadata?.full_name
				})
			}

			// Get active subscription (only one source of truth)
			const { data: subscription } = await supabase
				.from('subscriptions')
				.select('*')
				.eq('user_id', authUser.id)
				.in('status', ['active', 'pending'])
				.order('created_at', { ascending: false }) // ✅ Get latest
				.limit(1)
				.maybeSingle() // ✅ Don't throw if none found

			setCurrentSubscription(subscription)
			setLoading(false)
		} catch (error) {
			console.error('Error loading user data:', error)
			setLoading(false)
		}
	}

	const loadPlans = async () => {
		try {
			const response = await fetch('/api/plans')
			const data = await response.json()
			console.log('📋 Loaded plans:', data.plans)

			if (data.success) {
				setPlans(data.plans)
			}
		} catch (error) {
			console.error('Error loading plans:', error)
		}
	}

	// ✅ FIX: Create config function that takes plan as parameter
	const createPaymentConfig = (plan: FlutterwavePlan) => ({
		public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
		tx_ref: Date.now().toString(),
		amount: plan.amount,
		currency: plan.currency,
		payment_options: 'card,googlepay,applepay',
		payment_plan: plan.id, // Flutterwave plan ID
		customer: {
			email: user?.email || '',
			name: user?.user_metadata?.full_name || user?.email || ''
		},
		customizations: {
			title: `Subscribe to ${plan.name}`,
			description: `${plan.interval} subscription`
		},
		meta: {
			userId: user?.id,
			user_email: user?.email,
			plan_id: plan.id.toString()
		}
	})

	const handleSubscribe = async (plan: FlutterwavePlan) => {
		if (!user) {
			alert('Please sign in to subscribe')
			return
		}

		// ✅ FIX: Create config with the plan parameter (not state)
		const config = createPaymentConfig(plan)

		console.log('💳 Payment config:', config)

		// ✅ FIX: Call useFlutterwave with the fresh config
		// @ts-ignore
		const handleFlutterPayment = useFlutterwave(config)

		handleFlutterPayment({
			callback: async (response) => {
				console.log('Payment response:', response)

				// Verify and create subscription
				await fetch('/api/subscription/verify', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						transactionId: response.transaction_id,
						planId: plan.id,
						planToken: plan.plan_token
					})
				})

				closePaymentModal()
				loadUserData() // Reload to show new subscription
			},
			onClose: () => {
				console.log('Payment modal closed')
			}
		})
	}

	// Get plan details for current subscription
	const getCurrentPlanDetails = () => {
		if (!currentSubscription) return null
		return plans.find(
			(p) => p.id.toString() === currentSubscription.flutterwave_plan_id
		)
	}

	const currentPlanDetails = getCurrentPlanDetails()

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='text-xl'>Loading...</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className='max-w-4xl mx-auto p-6'>
				<h1 className='text-3xl font-bold mb-4'>Please Sign In</h1>
				<p className='mb-4'>
					You need to sign in to view subscription plans.
				</p>
				<a
					href='/auth/signin'
					className='text-blue-600 hover:underline'>
					Go to Sign In
				</a>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-white to-orange-50'>
			<div className='max-w-6xl mx-auto px-4 py-12'>
				{/* Breadcrumb */}
				<nav className='mb-8'>
					<ol className='flex items-center space-x-2 text-sm text-gray-600'>
						<li>
							<a
								href='/'
								className='hover:text-flutterwave-orange'>
								Home
							</a>
						</li>
						<li>/</li>
						<li className='text-flutterwave-dark font-medium'>
							Subscription Plans
						</li>
					</ol>
				</nav>
				<h1 className='text-4xl font-bold mb-4 text-flutterwave-dark'>
					Choose Your Plan
				</h1>
				<p className='text-gray-600 mb-12'>
					Start with a plan that fits your needs. Cancel anytime.
				</p>

				{/* Current Subscription Status */}
				{currentSubscription && currentPlanDetails && (
					<div className='mb-8 p-6 bg-linear-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl shadow-sm'>
						<div className='flex items-center gap-3 mb-3'>
							<div className='w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M5 13l4 4L19 7'
									/>
								</svg>
							</div>
							<h2 className='text-2xl font-bold text-orange-900'>
								Active Subscription
							</h2>
						</div>
						<p className='text-orange-800 text-lg mb-2'>
							You're currently on the{' '}
							<strong className='text-orange-900'>
								{currentPlanDetails.name}
							</strong>{' '}
							plan
						</p>
						<div className='flex gap-4 mt-4 text-sm'>
							<div className='px-4 py-2 bg-white rounded-lg border border-orange-200'>
								<span className='text-gray-600'>Status: </span>
								<span className='font-semibold text-orange-700 capitalize'>
									{currentSubscription.status}
								</span>
							</div>
							{currentSubscription.current_period_end && (
								<div className='px-4 py-2 bg-white rounded-lg border border-orange-200'>
									<span className='text-gray-600'>
										Next billing:{' '}
									</span>
									<span className='font-semibold text-orange-700'>
										{new Date(
											currentSubscription.current_period_end
										).toLocaleDateString()}
									</span>
								</div>
							)}
						</div>
					</div>
				)}
				{/* Available Plans */}
				<div className='grid md:grid-cols-2 gap-6'>
					{plans.map((plan) => {
						const isCurrentPlan =
							currentSubscription?.flutterwave_plan_id ===
							plan.id.toString()

						return (
							<div
								key={plan.id}
								className={`relative border-2 rounded-xl p-8 transition-all duration-300 ${
									isCurrentPlan
										? 'border-orange-500 bg-linear-to-br from-orange-50 to-yellow-50 shadow-lg scale-105'
										: 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-xl'
								}`}>
								{isCurrentPlan && (
									<div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
										<span className='px-4 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full shadow-md'>
											Current Plan
										</span>
									</div>
								)}

								<div className='text-center mb-6'>
									<h3 className='text-2xl font-bold text-gray-900 mb-2'>
										{plan.name}
									</h3>
									<div className='flex items-baseline justify-center gap-1'>
										<span className='text-5xl font-bold text-orange-600'>
											{plan.currency === 'NGN'
												? '₦'
												: plan.currency === 'USD'
												? '$'
												: plan.currency}
											{plan.amount.toLocaleString()}
										</span>
										<span className='text-xl text-gray-600'>
											/{plan.interval}
										</span>
									</div>
								</div>

								{isCurrentPlan ? (
									<button
										disabled
										className='w-full bg-gray-300 text-gray-600 py-4 rounded-xl font-semibold cursor-not-allowed opacity-60'>
										✓ Active Plan
									</button>
								) : (
									<button
										onClick={() => handleSubscribe(plan)}
										className='w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg'>
										{currentSubscription
											? 'Switch to This Plan'
											: 'Subscribe Now'}
									</button>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
