'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Navigation() {
	const pathname = usePathname()
	const router = useRouter()
	const [user, setUser] = useState<any>(null)
	const supabase = createClient()

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user }
			} = await supabase.auth.getUser()
			setUser(user)
		}
		getUser()
	}, [])

	const handleSignOut = async () => {
		await supabase.auth.signOut()
		router.push('/')
		router.refresh()
	}

	return (
		<nav className='border-b bg-white/80 backdrop-blur-md sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link href='/' className='flex items-center space-x-2'>
						<div className='w-8 h-8 bg-linear-to-br from-flutterwave-orange to-orange-600 rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-lg'>
								F
							</span>
						</div>
						<span className='font-bold text-xl text-flutterwave-dark'>
							FW × Supabase
						</span>
						{/* Environment Badge */}
						{process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes(
							'TEST'
						) && (
							<span className='ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded'>
								DEMO MODE
							</span>
						)}
					</Link>

					{/* Navigation Links */}
					<div className='hidden md:flex items-center space-x-8'>
						{user && (
							<>
								<Link
									href='/'
									className={`text-sm font-medium transition-colors ${
										pathname === '/'
											? 'text-flutterwave-orange'
											: 'text-gray-600 hover:text-flutterwave-dark'
									}`}>
									Home
								</Link>
								<Link
									href='/subscription'
									className={`text-sm font-medium transition-colors ${
										pathname === '/subscription'
											? 'text-flutterwave-orange'
											: 'text-gray-600 hover:text-flutterwave-dark'
									}`}>
									Plans
								</Link>
								<Link
									href='/dashboard/subscription'
									className={`text-sm font-medium transition-colors ${
										pathname === '/dashboard/subscription'
											? 'text-flutterwave-orange'
											: 'text-gray-600 hover:text-flutterwave-dark'
									}`}>
									Dashboard
								</Link>
							</>
						)}
					</div>

					{/* Auth Buttons */}
					<div className='flex items-center space-x-4'>
						{user ? (
							<div className='flex items-center space-x-4'>
								<div className='h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
									{user?.user_metadata?.avatar_url ? (
										<img
											src={user.user_metadata.avatar_url}
											alt='User avatar'
											className='h-full w-full object-cover'
										/>
									) : (
										<span className='text-sm font-medium text-gray-600'>
											{user.email?.[0]?.toUpperCase()}
										</span>
									)}
								</div>

								<button
									onClick={handleSignOut}
									className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors'>
									Sign Out
								</button>
							</div>
						) : (
							<Link
								href='/auth/signin'
								className='px-4 py-2 text-sm font-medium text-white bg-flutterwave-orange hover:bg-orange-600 rounded-lg transition-colors'>
								Sign In
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
