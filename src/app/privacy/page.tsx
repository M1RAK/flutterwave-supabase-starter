import Link from 'next/link'

export const metadata = {
	title: 'Privacy Policy',
	description: 'Privacy policy for the Flutterwave × Supabase SaaS demo'
}

export default function PrivacyPage() {
	return (
		<div className='min-h-screen bg-linear-to-b from-white to-orange-50'>
			<div className='max-w-4xl mx-auto px-4 py-12'>
				<div className='mb-12'>
					<Link
						href='/'
						className='text-flutterwave-orange hover:text-orange-600 font-medium mb-4 inline-block'>
						← Back to Home
					</Link>
					<h1 className='text-4xl font-bold text-flutterwave-dark mb-4'>
						Privacy Policy
					</h1>
					<p className='text-gray-600'>
						Last updated: January 30, 2026
					</p>
				</div>

				<div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-lg max-w-none'>
					<section className='mb-8'>
						<h2>1. Overview</h2>
						<p>
							This Privacy Policy explains how information is
							collected and used in this demo SaaS project.
						</p>
					</section>

					<section className='mb-8'>
						<h2>2. Information We Collect</h2>
						<ul>
							<li>Email address and basic account information</li>
							<li>
								Authentication data from providers such as
								Google
							</li>
							<li>Basic usage and session data</li>
						</ul>
					</section>

					<section className='mb-8'>
						<h2>3. Third-Party Services</h2>
						<p>
							We rely on third-party services to operate the demo:
						</p>
						<ul>
							<li>
								Supabase for authentication and database storage
							</li>
							<li>Google for OAuth login (if used)</li>
							<li>
								Flutterwave for payment processing (if enabled)
							</li>
						</ul>
						<p>
							These providers process data according to their own
							privacy policies.
						</p>
					</section>

					<section className='mb-8'>
						<h2>4. Payments</h2>
						<p>
							Payment details are handled entirely by Flutterwave.
							We do not store card or banking information on our
							servers.
						</p>
					</section>

					<section className='mb-8'>
						<h2>5. Cookies</h2>
						<p>
							We use essential cookies for authentication and
							session management. No advertising or tracking
							cookies are used.
						</p>
					</section>

					<section className='mb-8'>
						<h2>6. Data Retention</h2>
						<p>
							This is a demo project. Data may be deleted at any
							time without notice.
						</p>
					</section>

					<section className='mb-8'>
						<h2>7. Children’s Privacy</h2>
						<p>
							The Service is not intended for users under 18. We
							do not knowingly collect data from children.
						</p>
					</section>

					<section>
						<h2>8. Contact</h2>
						<p>
							For privacy questions, contact:
							<br />
							<strong>Email:</strong> hello@magpie.ink
						</p>
					</section>
				</div>
			</div>
		</div>
	)
}
