'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
	Subscription,
	FlutterwavePlan,
	FlutterwaveTransaction
} from '@/types/database'

export default function SubscriptionDashboard() {
	const [user, setUser] = useState<any>(null)
	const [subscription, setSubscription] = useState<Subscription | null>(null)
	const [planDetails, setPlanDetails] = useState<FlutterwavePlan | null>(null)
	const [transactions, setTransactions] = useState<FlutterwaveTransaction[]>(
		[]
	)
	const [loading, setLoading] = useState(true)
	const [cancelling, setCancelling] = useState(false)
	const supabase = createClient()

	useEffect(() => {
		loadDashboardData()
	}, [])

	const loadDashboardData = async () => {
		try {
			const {
				data: { user: authUser }
			} = await supabase.auth.getUser()

			if (!authUser) {
				setLoading(false)
				return
			}

			setUser(authUser)

			// Load subscription by user_id
			const { data: sub } = await supabase
				.from('subscriptions')
				.select('*')
				.eq('user_id', authUser.id) // ✅ Direct userId lookup
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

				// ✅ Use customer_email directly (Flutterwave's email)
				const flutterwaveEmail = sub.customer_email
				console.log('📧 Fetching transactions for:', flutterwaveEmail)

				// Fetch transaction history
				const txResponse = await fetch(
					`/api/transactions?email=${encodeURIComponent(
						flutterwaveEmail
					)}`
				)
				const txData = await txResponse.json()

				console.log('TxData: ', txData)

				if (txData.success) {
					setTransactions(txData.transactions)
				}
			}

			setLoading(false)
		} catch (error) {
			console.error('Error loading dashboard:', error)
			setLoading(false)
		}
	}

	const handleCancelSubscription = async () => {
		if (!subscription) return

		const confirmed = window.confirm(
			'Are you sure you want to cancel your subscription?'
		)

		if (!confirmed) return

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
				alert('Subscription cancelled successfully')
				loadDashboardData()
			} else {
				alert('Failed to cancel: ' + data.error)
			}
		} catch (error) {
			console.error('Error cancelling:', error)
			alert('Failed to cancel subscription')
		} finally {
			setCancelling(false)
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-linear-to-b from-white to-orange-50 flex items-center justify-center'>
				<div className='text-xl text-gray-600'>
					Loading dashboard...
				</div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-linear-to-b from-white to-orange-50 flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold mb-4'>Please Sign In</h1>
					<a
						href='/auth/signin'
						className='text-flutterwave-orange hover:underline'>
						Go to Sign In
					</a>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-white to-orange-50'>
			<div className='max-w-7xl mx-auto px-4 py-12'>
				{/* Header with User Info */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h1 className='text-4xl font-bold text-flutterwave-dark mb-2'>
								Dashboard
							</h1>
							<p className='text-gray-600'>
								Manage your subscription and billing
							</p>
						</div>

						{/* User Profile Card */}
						<div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
							<div className='flex items-center space-x-3'>
								<div className='h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
									{user?.user_metadata?.avatar_url && (
										<img
											src={user.user_metadata.avatar_url}
											alt='User avatar'
											className='h-full w-full object-cover'
										/>
									)}
								</div>
								<div>
									<p className='font-semibold text-gray-900'>
										{user.user_metadata?.full_name ||
											'User'}
									</p>
									<p className='text-sm text-gray-600'>
										{user.email}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{subscription ? (
					<div className='grid lg:grid-cols-3 gap-6'>
						{/* Main Content - 2 columns */}
						<div className='lg:col-span-2 space-y-6'>
							{/* Current Plan Card */}
							<div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
								<div className='bg-linear-to-r from-flutterwave-orange to-orange-600 p-6 text-white'>
									<h2 className='text-2xl font-bold mb-2'>
										Current Plan
									</h2>
									<p className='opacity-90'>
										Your active subscription details
									</p>
								</div>

								<div className='p-6 space-y-4'>
									{planDetails && (
										<>
											<div className='flex justify-between items-center pb-4 border-b'>
												<span className='text-gray-600'>
													Plan
												</span>
												<span className='font-semibold text-xl'>
													{planDetails.name}
												</span>
											</div>
											<div className='flex justify-between items-center pb-4 border-b'>
												<span className='text-gray-600'>
													Price
												</span>
												<span className='font-semibold text-xl'>
													{planDetails.currency ===
														'USD' || '₦'}
													{planDetails.amount.toLocaleString()}
													/{planDetails.interval}
												</span>
											</div>
										</>
									)}

									<div className='flex justify-between items-center pb-4 border-b'>
										<span className='text-gray-600'>
											Status
										</span>
										<span
											className={`px-3 py-1 rounded-full text-sm font-semibold ${
												subscription.status === 'active'
													? 'bg-green-100 text-green-700'
													: 'bg-orange-100 text-orange-700'
											}`}>
											{subscription.status
												.charAt(0)
												.toUpperCase() +
												subscription.status.slice(1)}
										</span>
									</div>

									{subscription.current_period_end && (
										<div className='flex justify-between items-center'>
											<span className='text-gray-600'>
												Next Billing
											</span>
											<span className='font-semibold'>
												{new Date(
													subscription.current_period_end
												).toLocaleDateString('en-US', {
													month: 'long',
													day: 'numeric',
													year: 'numeric'
												})}
											</span>
										</div>
									)}

									{subscription.cancel_at_period_end && (
										<div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4'>
											<p className='text-orange-700 font-medium'>
												⚠️ Subscription will be
												cancelled at the end of the
												current billing period
											</p>
										</div>
									)}

									<div className='pt-4'>
										{!subscription.cancel_at_period_end && (
											<button
												onClick={
													handleCancelSubscription
												}
												disabled={cancelling}
												className='w-full px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-all'>
												{cancelling
													? 'Cancelling...'
													: 'Cancel Subscription'}
											</button>
										)}
									</div>
								</div>
							</div>

							{/* Payment History */}
							<div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
								<h2 className='text-2xl font-bold mb-6 text-flutterwave-dark'>
									Payment History
								</h2>

								{transactions.length === 0 ? (
									<div className='text-center py-12'>
										<svg
											className='w-16 h-16 mx-auto text-gray-300 mb-4'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
											/>
										</svg>
										<p className='text-gray-500'>
											No payment history yet
										</p>
									</div>
								) : (
									<div className='overflow-x-auto'>
										<table className='w-full'>
											<thead>
												<tr className='border-b border-gray-200'>
													<th className='text-left py-3 px-4 font-semibold text-gray-700'>
														Date
													</th>
													<th className='text-left py-3 px-4 font-semibold text-gray-700'>
														Amount
													</th>
													<th className='text-left py-3 px-4 font-semibold text-gray-700'>
														Status
													</th>
													<th className='text-left py-3 px-4 font-semibold text-gray-700'>
														Reference
													</th>
												</tr>
											</thead>
											<tbody>
												{transactions.map((tx) => (
													<tr
														key={tx.id}
														className='border-b border-gray-100 hover:bg-gray-50'>
														<td className='py-4 px-4'>
															{new Date(
																tx.created_at
															).toLocaleDateString()}
														</td>
														<td className='py-4 px-4 font-semibold'>
															{tx.currency ===
																'USD' || '₦'}
															{tx.amount.toLocaleString()}
														</td>
														<td className='py-4 px-4'>
															<span
																className={`px-3 py-1 rounded-full text-xs font-semibold ${
																	tx.status ===
																	'successful'
																		? 'bg-green-100 text-green-700'
																		: tx.status ===
																		  'failed'
																		? 'bg-red-100 text-red-700'
																		: 'bg-orange-100 text-orange-700'
																}`}>
																{tx.status}
															</span>
														</td>
														<td className='py-4 px-4 text-sm text-gray-600 font-mono'>
															{tx.tx_ref}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						</div>

						{/* Sidebar - 1 column */}
						<div className='space-y-6'>
							{/* Quick Actions */}
							<div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
								<h3 className='font-semibold text-lg mb-4'>
									Quick Actions
								</h3>
								<div className='space-y-3'>
									<a
										href='/subscription'
										className='block w-full px-4 py-3 bg-flutterwave-orange text-white text-center rounded-lg hover:bg-orange-600 transition-all font-medium'>
										View All Plans
									</a>
									<button className='block w-full px-4 py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-all font-medium'>
										Update Payment Method
									</button>
									<button className='block w-full px-4 py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-all font-medium'>
										Download Invoices
									</button>
								</div>
							</div>

							{/* Account Info */}
							<div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
								<h3 className='font-semibold text-lg mb-4'>
									Account Info
								</h3>
								<div className='space-y-3 text-sm'>
									<div>
										<p className='text-gray-600'>Email</p>
										<p className='font-medium'>
											{user.email}
										</p>
									</div>
									<div>
										<p className='text-gray-600'>
											Member Since
										</p>
										<p className='font-medium'>
											{new Date(
												user.created_at
											).toLocaleDateString('en-US', {
												month: 'long',
												year: 'numeric'
											})}
										</p>
									</div>
									<div>
										<p className='text-gray-600'>User ID</p>
										<p className='font-mono text-xs'>
											{user.id.substring(0, 20)}...
										</p>
									</div>
								</div>
							</div>

							{/* Support */}
							<div className='bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100'>
								<h3 className='font-semibold text-lg mb-2'>
									Need Help?
								</h3>
								<p className='text-sm text-gray-600 mb-4'>
									Our support team is here to help you with
									any questions.
								</p>
								<button className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm'>
									Contact Support
								</button>
							</div>
						</div>
					</div>
				) : (
					/* No Subscription State */
					<div className='bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center'>
						<div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
							<svg
								className='w-10 h-10 text-flutterwave-orange'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
								/>
							</svg>
						</div>
						<h2 className='text-2xl font-bold mb-2'>
							No Active Subscription
						</h2>
						<p className='text-gray-600 mb-8'>
							You don't have an active subscription. Choose a plan
							to get started.
						</p>
						<a
							href='/subscription'
							className='inline-block px-8 py-3 bg-flutterwave-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105'>
							View Available Plans
						</a>
					</div>
				)}
			</div>
		</div>
	)
}
