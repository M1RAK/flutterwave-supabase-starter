'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'

export default function SubscriptionDashboard() {
	const { user, loading: authLoading } = useAuth()
	const {
		subscription,
		planDetails,
		transactions,
		loading,
		cancelling,
		cancelSubscription
	} = useSubscription(user?.id)

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
			<div className='max-w-7xl mx-auto px-4 py-8 sm:py-12'>
				{/* Header with User Info */}
				<div className='mb-8'>
					<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6'>
						<div>
							<h1 className='text-3xl sm:text-4xl font-bold text-flutterwave-dark mb-2'>
								Dashboard
							</h1>
							<p className='text-gray-600'>
								Manage your subscription and billing
							</p>
						</div>

						{/* User Profile Card */}
						<div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 w-full lg:w-auto'>
							<div className='flex items-center gap-3'>
								<div className='h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
									{user?.user_metadata?.avatar_url && (
										<img
											src={user.user_metadata.avatar_url}
											alt='User avatar'
											className='h-full w-full object-cover'
										/>
									)}
								</div>
								<div className='min-w-0'>
									<p className='font-semibold text-gray-900'>
										{user.user_metadata?.full_name ||
											'User'}
									</p>
									<p className='text-sm text-gray-600 break-all sm:break-normal'>
										{user.email}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{subscription ? (
					<div className='max-w-5xl mx-auto space-y-6'>
						{/* Current Plan Card */}
						<div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
							<div className='bg-linear-to-r from-orange-500 to-orange-600 p-6 sm:p-8 text-white'>
								<div className='flex items-center justify-between'>
									<div>
										<h2 className='text-2xl sm:text-3xl font-bold mb-2'>
											Current Plan
										</h2>
										<p className='opacity-90 text-base sm:text-lg'>
											Your active subscription details
										</p>
									</div>
								</div>
							</div>

							<div className='p-6 sm:p-8'>
								<div className='grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6'>
									{planDetails && (
										<>
											<div className='p-4 bg-linear-to-br from-gray-50 to-white rounded-lg border border-gray-200'>
												<span className='text-sm text-gray-600 block mb-1'>
													Plan
												</span>
												<span className='font-bold text-2xl text-gray-900'>
													{planDetails.name}
												</span>
											</div>
											<div className='p-4 bg-linear-to-br from-orange-50 to-white rounded-lg border border-orange-200'>
												<span className='text-sm text-gray-600 block mb-1'>
													Price
												</span>
												<span className='font-bold text-2xl text-orange-600'>
													{planDetails.currency ===
													'NGN'
														? '₦'
														: '$'}
													{planDetails.amount.toLocaleString()}
													<span className='text-sm sm:text-base text-gray-600'>
														/{planDetails.interval}
													</span>
												</span>
											</div>
										</>
									)}
									<div className='p-4 bg-linear-to-br from-gray-50 to-white rounded-lg border border-gray-200'>
										<span className='text-sm text-gray-600 block mb-1'>
											Status
										</span>
										<span
											className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
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
										<div className='p-4 bg-linear-to-br from-blue-50 to-white rounded-lg border border-blue-200'>
											<span className='text-sm text-gray-600 block mb-1'>
												Next Billing
											</span>
											<span className='font-bold text-lg text-gray-900'>
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
								</div>

								{subscription.cancel_at_period_end && (
									<div className='bg-orange-50 border-2 border-orange-300 rounded-xl p-5 mb-6'>
										<div className='flex items-start sm:items-center gap-3'>
											<svg
												className='w-6 h-6 text-orange-600 shrink-0'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
												/>
											</svg>
											<p className='text-orange-800 font-semibold'>
												Subscription will be cancelled
												at the end of the current
												billing period
											</p>
										</div>
									</div>
								)}

								<div className='flex flex-col sm:flex-row gap-4'>
									<a
										href='/subscription'
										className='flex-1 px-6 py-4 bg-linear-to-r from-orange-500 to-orange-600 text-white text-center font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg'>
										View All Plans
									</a>
									{!subscription.cancel_at_period_end && (
										<button
											onClick={cancelSubscription}
											disabled={cancelling}
											className='flex-1 px-6 py-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50 transition-all duration-300 border-2 border-red-200'>
											{cancelling
												? 'Cancelling...'
												: 'Cancel Subscription'}
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Payment History */}
						<div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8'>
							<h2 className='text-xl sm:text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3'>
								<svg
									className='w-7 h-7 text-orange-500'
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
								Payment History
							</h2>

							{transactions.length === 0 ? (
								<div className='text-center py-12 sm:py-16 bg-gray-50 rounded-xl'>
									<div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
										<svg
											className='w-10 h-10 text-gray-400'
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
									</div>
									<p className='text-gray-500 text-lg'>
										No payment history yet
									</p>
								</div>
							) : (
								<div className='overflow-x-auto rounded-lg border border-gray-200'>
									<table className='min-w-[640px] w-full'>
										<thead className='bg-gray-50'>
											<tr>
												<th className='text-left py-4 px-6 font-semibold text-gray-700'>
													Date
												</th>
												<th className='text-left py-4 px-6 font-semibold text-gray-700'>
													Amount
												</th>
												<th className='text-left py-4 px-6 font-semibold text-gray-700'>
													Status
												</th>
												<th className='text-left py-4 px-6 font-semibold text-gray-700'>
													Reference
												</th>
											</tr>
										</thead>
										<tbody className='divide-y divide-gray-200'>
											{transactions.map((tx) => (
												<tr
													key={tx.id}
													className='hover:bg-gray-50 transition-colors'>
													<td className='py-4 px-6 text-gray-900'>
														{new Date(
															tx.created_at
														).toLocaleDateString(
															'en-US',
															{
																month: 'short',
																day: 'numeric',
																year: 'numeric'
															}
														)}
													</td>
													<td className='py-4 px-6 font-bold text-gray-900'>
														{tx.currency === 'NGN'
															? '₦'
															: '$'}
														{tx.amount.toLocaleString()}
													</td>
													<td className='py-4 px-6'>
														<span
															className={`px-3 py-1 rounded-full text-xs font-bold ${
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
													<td className='py-4 px-6 text-sm text-gray-600 font-mono'>
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
				) : (
					/* No Subscription State */
					<div className='max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10 md:p-12 text-center'>
						<div className='w-24 h-24 bg-linear-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6'>
							<svg
								className='w-12 h-12 text-orange-500'
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
						<h2 className='text-2xl sm:text-3xl font-bold mb-3 text-gray-900'>
							No Active Subscription
						</h2>
						<p className='text-gray-600 text-base sm:text-lg mb-8'>
							You don't have an active subscription. Choose a plan
							to get started and unlock all features.
						</p>
						<a
							href='/subscription'
							className='inline-block px-10 py-4 bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
							View Available Plans
						</a>
					</div>
				)}
			</div>
		</div>
	)
}
