import Link from 'next/link'

export const metadata = {
	title: 'Terms of Service',
	description: 'Terms for using the Flutterwave × Supabase SaaS demo'
}

export default function TermsPage() {
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
						Terms of Service
					</h1>
					<p className='text-gray-600'>
						Last updated: January 30, 2026
					</p>
				</div>

				<div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-lg max-w-none'>
					<section className='mb-8'>
						<h2>1. Agreement</h2>
						<p>
							This Service is a demo SaaS boilerplate built using
							Flutterwave and Supabase. By using it, you agree to
							these Terms. If you do not agree, do not use the
							Service.
						</p>
					</section>

					<section className='mb-8'>
						<h2>2. Purpose of the Service</h2>
						<p>
							The Service exists for demonstration and evaluation
							purposes only. It is intended to showcase
							authentication, payments, and subscription flows.
						</p>
						<p>
							There is no guarantee of uptime, data persistence,
							or production readiness.
						</p>
					</section>

					<section className='mb-8'>
						<h2>3. Accounts</h2>
						<p>
							You may create an account using email/password or
							third-party providers such as Google.
						</p>
						<p>
							You are responsible for securing your account and
							all activity performed under it.
						</p>
						<p>
							We may suspend or delete accounts used for abuse,
							testing attacks, or illegal activity.
						</p>
					</section>

					<section className='mb-8'>
						<h2>4. Payments</h2>
						<p>
							Payments, if enabled, are processed by Flutterwave.
							We do not store card or banking details.
						</p>
						<p>
							Any payments made should be treated as test or
							evaluation transactions unless clearly stated
							otherwise.
						</p>
					</section>

					<section className='mb-8'>
						<h2>5. Acceptable Use</h2>
						<p>You agree not to:</p>
						<ul>
							<li>Attempt to exploit or disrupt the Service</li>
							<li>Upload malicious code</li>
							<li>Use the Service for unlawful purposes</li>
						</ul>
					</section>

					<section className='mb-8'>
						<h2>6. Intellectual Property</h2>
						<p>
							The Service, its codebase, and branding belong to
							the project owner. You may evaluate the Service but
							may not copy or redistribute it without permission.
						</p>
					</section>

					<section className='mb-8'>
						<h2>7. Disclaimer</h2>
						<p>
							The Service is provided “as is” without warranties
							of any kind. We make no guarantees regarding
							reliability, security, or availability.
						</p>
					</section>

					<section>
						<h2>8. Contact</h2>
						<p>
							For questions, contact:
							<br />
							<strong>Email:</strong> hello@magpie.ink
						</p>
					</section>
				</div>
			</div>
		</div>
	)
}
