import Link from 'next/link'

export default function Home() {
	return (
		<div className='min-h-screen bg-linear-to-b from-white to-orange-50'>
			{/* Hero Section */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-16'>
				<div className='text-center'>
					<h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-flutterwave-dark mb-6'>
						Subscription Billing Made{' '}
						<span className='text-transparent bg-clip-text bg-linear-to-r from-flutterwave-orange to-orange-600'>
							Simple
						</span>
					</h1>
					<p className='text-base sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
						Launch your SaaS in minutes with Flutterwave payments
						and Supabase backend. Production-ready authentication,
						subscription billing, and user management.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link
							href='/auth/sign-in'
							className='px-8 py-4 bg-flutterwave-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105'>
							Get Started Free
						</Link>
						<Link
							href='/plans'
							className='px-8 py-4 bg-white text-flutterwave-dark font-semibold rounded-lg border-2 border-gray-200 hover:border-flutterwave-orange transition-all'>
							View Plans
						</Link>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
				<div className='text-center mb-12'>
					<h2 className='text-2xl sm:text-3xl font-bold text-flutterwave-dark mb-4'>
						Everything You Need to Launch
					</h2>
					<p className='text-gray-600'>
						Built with best practices and production-ready from day
						one
					</p>
				</div>

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{/* Feature 1 */}
					<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
						<div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-flutterwave-orange'
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
						<h3 className='text-xl font-semibold mb-2'>
							Flutterwave Payments
						</h3>
						<p className='text-gray-600'>
							Accept payments via cards, bank transfers, mobile
							money, and more. Automatic recurring billing with
							webhook support.
						</p>
					</div>

					{/* Feature 2 */}
					<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
						<div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-green-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold mb-2'>
							Supabase Auth
						</h3>
						<p className='text-gray-600'>
							Email/password and OAuth (Google, GitHub, etc.)
							authentication. Row-level security and user
							management built-in.
						</p>
					</div>

					{/* Feature 3 */}
					<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
						<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-blue-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold mb-2'>
							PostgreSQL Database
						</h3>
						<p className='text-gray-600'>
							Powerful Supabase database with automatic API
							generation. Real-time subscriptions and serverless
							functions.
						</p>
					</div>

					{/* Feature 4 */}
					<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
						<div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-purple-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold mb-2'>
							Subscription Management
						</h3>
						<p className='text-gray-600'>
							Complete subscription lifecycle management.
							Upgrades, downgrades, cancellations, and billing
							history.
						</p>
					</div>

					{/* Feature 5 */}
					<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
						<div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-yellow-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 10V3L4 14h7v7l9-11h-7z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold mb-2'>
							Webhook Events
						</h3>
						<p className='text-gray-600'>
							Real-time payment notifications with webhook
							verification. Automatic subscription status updates.
						</p>
					</div>

					{/* Feature 6 */}
					<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
						<div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4'>
							<svg
								className='w-6 h-6 text-red-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-semibold mb-2'>
							Next.js 15 Ready
						</h3>
						<p className='text-gray-600'>
							Built with Next.js App Router, TypeScript, and
							Tailwind CSS. Server components and API routes
							included.
						</p>
					</div>
				</div>
			</div>

			{/* Tech Stack Section */}
			<div className='bg-white py-12 sm:py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-2xl sm:text-3xl font-bold text-flutterwave-dark mb-4'>
							Powered by Industry Leaders
						</h2>
						<p className='text-gray-600'>
							Built on trusted, production-ready infrastructure
						</p>
					</div>

					<div className='grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center'>
						<div className='text-center'>
							<div className='text-3xl sm:text-4xl font-bold text-flutterwave-orange mb-2'>
								Flutterwave
							</div>
							<p className='text-sm text-gray-600'>
								Payment Processing
							</p>
						</div>
						<div className='text-center'>
							<div className='text-3xl sm:text-4xl font-bold text-green-600 mb-2'>
								Supabase
							</div>
							<p className='text-sm text-gray-600'>
								Backend & Auth
							</p>
						</div>
						<div className='text-center'>
							<div className='text-3xl sm:text-4xl font-bold text-black mb-2'>
								Next.js
							</div>
							<p className='text-sm text-gray-600'>
								React Framework
							</p>
						</div>
						<div className='text-center'>
							<div className='text-3xl sm:text-4xl font-bold text-blue-600 mb-2'>
								TypeScript
							</div>
							<p className='text-sm text-gray-600'>Type Safety</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
				<div className='bg-linear-to-r from-flutterwave-orange to-orange-600 rounded-2xl p-6 sm:p-10 lg:p-12 text-center text-white'>
					<h2 className='text-2xl sm:text-3xl font-bold mb-4'>
						Ready to Launch Your SaaS?
					</h2>
					<p className='text-base sm:text-xl mb-8 opacity-90'>
						Get started in minutes with our production-ready
						template
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link
							href='/auth/signin'
							className='px-8 py-4 bg-white text-flutterwave-orange font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105'>
							Start Building Now
						</Link>
						<a
							href='https://github.com/m1rak/flutterwave-supabase-starter'
							target='_blank'
							rel='noopener noreferrer'
							className='px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-flutterwave-orange transition-all'>
							View on GitHub
						</a>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className='border-t py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0'>
						<p className='text-gray-600 text-sm'>
							© 2026 Flutterwave × Supabase SaaS Starter.
						</p>
						<div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6'>
							<Link
								href='/terms'
								className='text-gray-600 hover:text-flutterwave-orange text-sm'>
								Terms of Service
							</Link>
							<Link
								href='/privacy'
								className='text-gray-600 hover:text-flutterwave-orange text-sm'>
								Privacy Policy
							</Link>
							<a
								href='https://github.com/m1rak/flutterwave-supabase-starter'
								className='text-gray-600 hover:text-flutterwave-orange text-sm'>
								GitHub
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
