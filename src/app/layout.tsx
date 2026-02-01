import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import SetupBanner from '@/components/SetupBanner'

const bricolage = Bricolage_Grotesque({
	variable: '--font-dm-sans',
	subsets: ['latin'],
	weight: ['400', '500', '700']
})

export const metadata: Metadata = {
	title: 'Flutterwave × Supabase SaaS Starter',
	description:
		'Production-ready subscription billing with Flutterwave and Supabase'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<meta
				name='google-site-verification'
				content='74FJ-FQ0yrSHQfjXyj2jsUXaV2haLwPwWLwKG2H2UHc'
			/>
			<body className={`${bricolage.variable} antialiased`}>
				<Navigation />
				<SetupBanner />
				{children}
			</body>
		</html>
	)
}
