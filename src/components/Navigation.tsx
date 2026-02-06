'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function Navigation() {
	const pathname = usePathname()
	const router = useRouter()
	const { user } = useAuth()
	const supabase = createClient()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	const handleSignOut = async () => {
		await supabase.auth.signOut()
		setMobileMenuOpen(false)
		router.replace('/')
	}

	const isActive = (href: string) => pathname === href

	return (
		<nav className='sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					{/* Logo */}
					<Link href='/' className='flex items-center space-x-2'>
						<div className='w-8 h-8 bg-linear-to-br from-flutterwave-orange to-orange-600 rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-lg'>
								F
							</span>
						</div>
						<span className='font-bold text-xl text-flutterwave-dark hidden sm:block'>
							FW × Supabase
						</span>
						{process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes(
							'TEST'
						) && (
							<span className='ml-2 px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800'>
								DEMO MODE
							</span>
						)}
					</Link>

					{/* Desktop Nav */}
					{user && (
						<div className='hidden md:flex items-center space-x-8'>
							<Link
								href='/'
								className={`text-sm font-medium ${
									isActive('/')
										? 'text-flutterwave-orange'
										: 'text-gray-600 hover:text-flutterwave-dark'
								}`}>
								Home
							</Link>
							<Link
								href='/plans'
								className={`text-sm font-medium ${
									isActive('/plans')
										? 'text-flutterwave-orange'
										: 'text-gray-600 hover:text-flutterwave-dark'
								}`}>
								Plans
							</Link>
							<Link
								href='/dashboard'
								className={`text-sm font-medium ${
									isActive('/dashboard')
										? 'text-flutterwave-orange'
										: 'text-gray-600 hover:text-flutterwave-dark'
								}`}>
								Dashboard
							</Link>
						</div>
					)}

					{/* Desktop Auth */}
					<div className='hidden md:flex items-center space-x-4'>
						{user ? (
							<>
								<div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
									{user.user_metadata?.avatar_url ? (
										<img
											src={user.user_metadata.avatar_url}
											className='h-full w-full object-cover'
											alt='avatar'
										/>
									) : (
										<span className='text-sm font-medium text-gray-600'>
											{user.email?.[0]?.toUpperCase()}
										</span>
									)}
								</div>
								<button
									onClick={handleSignOut}
									className='px-4 py-2 text-sm font-medium bg-amber-500 rounded-lg text-gray-700 hover:text-gray-900'>
									Sign Out
								</button>
							</>
						) : (
							<Link
								href='/auth/sign-in'
								className='px-4 py-2 text-sm font-medium text-white bg-flutterwave-orange hover:bg-orange-600 rounded-lg'>
								Sign In
							</Link>
						)}
					</div>

					{/* Mobile Toggle */}
					<button
						onClick={() => setMobileMenuOpen((v) => !v)}
						className='md:hidden p-2 rounded-lg hover:bg-gray-100'
						aria-label='Toggle menu'>
						<svg
							className='w-6 h-6 text-gray-600'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							{mobileMenuOpen ? (
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							) : (
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className='md:hidden border-t bg-white px-4 py-4 space-y-3'>
					{user ? (
						<>
							<div className='flex items-center space-x-3 pb-3 border-b'>
								<div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
									{user.user_metadata?.avatar_url ? (
										<img
											src={user.user_metadata.avatar_url}
											className='h-full w-full object-cover'
											alt='avatar'
										/>
									) : (
										<span className='font-medium text-gray-600'>
											{user.email?.[0]?.toUpperCase()}
										</span>
									)}
								</div>
								<div className='min-w-0'>
									<p className='text-sm font-medium truncate'>
										{user.user_metadata?.full_name ||
											'User'}
									</p>
									<p className='text-xs text-gray-600 truncate'>
										{user.email}
									</p>
								</div>
							</div>

							<Link
								href='/'
								onClick={() => setMobileMenuOpen(false)}
								className={`block px-4 py-2 rounded-lg text-sm font-medium ${
									isActive('/')
										? 'bg-orange-50 text-flutterwave-orange'
										: 'text-gray-600 hover:bg-gray-50'
								}`}>
								Home
							</Link>

							<Link
								href='/plans'
								onClick={() => setMobileMenuOpen(false)}
								className={`block px-4 py-2 rounded-lg text-sm font-medium ${
									isActive('/plans')
										? 'bg-orange-50 text-flutterwave-orange'
										: 'text-gray-600 hover:bg-gray-50'
								}`}>
								Plans
							</Link>

							<Link
								href='/dashboard'
								onClick={() => setMobileMenuOpen(false)}
								className={`block px-4 py-2 rounded-lg text-sm font-medium ${
									isActive('/dashboard')
										? 'bg-orange-50 text-flutterwave-orange'
										: 'text-gray-600 hover:bg-gray-50'
								}`}>
								Dashboard
							</Link>

							<button
								onClick={handleSignOut}
								className='w-full text-left px-4 py-2 text-sm font-medium bg-amber-500 rounded-lg text-gray-700'>
								Sign Out
							</button>
						</>
					) : (
						<Link
							href='/auth/sign-in'
							onClick={() => setMobileMenuOpen(false)}
							className='block text-center px-4 py-2 text-sm font-medium text-white bg-flutterwave-orange hover:bg-orange-600 rounded-lg'>
							Sign In
						</Link>
					)}
				</div>
			)}
		</nav>
	)
}
