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
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const supabase = createClient()

	const handleSignOut = async () => {
		await supabase.auth.signOut()
		setMobileMenuOpen(false)
		router.replace('/')
	}

	const closeMobileMenu = () => setMobileMenuOpen(false)

	return (
		<nav className='border-b bg-white/80 backdrop-blur-md sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Logo />

					{/* Desktop Navigation */}
					<DesktopNav user={user} pathname={pathname} />

					{/* Desktop Auth */}
					<DesktopAuth user={user} onSignOut={handleSignOut} />

					{/* Mobile Menu Button */}
					<MobileMenuButton
						isOpen={mobileMenuOpen}
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					/>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<MobileMenu
					user={user}
					pathname={pathname}
					onSignOut={handleSignOut}
					onClose={closeMobileMenu}
				/>
			)}
		</nav>
	)
}

function Logo() {
	return (
		<Link href='/' className='flex items-center space-x-2'>
			<div className='w-8 h-8 bg-linear-to-br from-flutterwave-orange to-orange-600 rounded-lg flex items-center justify-center'>
				<span className='text-white font-bold text-lg'>F</span>
			</div>
			<span className='font-bold text-xl text-flutterwave-dark'>
				FW × Supabase
			</span>
			{process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes('TEST') && (
				<span className='ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded'>
					DEMO MODE
				</span>
			)}
		</Link>
	)
}

interface DesktopNavProps {
	user: any
	pathname: string
}

function DesktopNav({ user, pathname }: DesktopNavProps) {
	if (!user) return null

	return (
		<div className='hidden md:flex items-center space-x-8'>
			<NavLink href='/' pathname={pathname}>
				Home
			</NavLink>
			<NavLink href='/plans' pathname={pathname}>
				Plans
			</NavLink>
			<NavLink href='/dashboard' pathname={pathname}>
				Dashboard
			</NavLink>
		</div>
	)
}

interface DesktopAuthProps {
	user: any
	onSignOut: () => void
}

function DesktopAuth({ user, onSignOut }: DesktopAuthProps) {
	return (
		<div className='hidden md:flex items-center space-x-4'>
			{user ? (
				<>
					<UserAvatar user={user} />
					<button
						onClick={onSignOut}
						className='px-4 py-2 text-sm font-medium bg-amber-500 rounded-lg text-gray-700 hover:text-gray-900 transition-colors'>
						Sign Out
					</button>
				</>
			) : (
				<Link
					href='/auth/sign-in'
					className='px-4 py-2 text-sm font-medium text-white bg-flutterwave-orange hover:bg-orange-600 rounded-lg transition-colors'>
					Sign In
				</Link>
			)}
		</div>
	)
}

interface MobileMenuButtonProps {
	isOpen: boolean
	onClick: () => void
}

function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
	return (
		<button
			onClick={onClick}
			className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
			aria-label='Toggle menu'>
			<svg
				className='w-6 h-6 text-gray-600'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'>
				{isOpen ? (
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
	)
}

interface MobileMenuProps {
	user: any
	pathname: string
	onSignOut: () => void
	onClose: () => void
}

function MobileMenu({ user, pathname, onSignOut, onClose }: MobileMenuProps) {
	return (
		<div className='md:hidden border-t bg-white'>
			<div className='px-4 py-4 space-y-3'>
				{user ? (
					<>
						{/* User Info */}
						<div className='flex items-center space-x-3 pb-3 border-b'>
							<UserAvatar user={user} />
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium text-gray-900 truncate'>
									{user.user_metadata?.full_name || 'User'}
								</p>
								<p className='text-xs text-gray-600 truncate'>
									{user.email}
								</p>
							</div>
						</div>

						{/* Nav Links */}
						<MobileNavLink
							href='/'
							pathname={pathname}
							onClick={onClose}>
							Home
						</MobileNavLink>
						<MobileNavLink
							href='/plans'
							pathname={pathname}
							onClick={onClose}>
							Plans
						</MobileNavLink>
						<MobileNavLink
							href='/dashboard'
							pathname={pathname}
							onClick={onClose}>
							Dashboard
						</MobileNavLink>

						{/* Sign Out */}
						<button
							onClick={onSignOut}
							className='w-full text-left px-4 py-2 text-sm font-medium bg-amber-500 rounded-lg text-gray-700 hover:text-gray-900 transition-colors'>
							Sign Out
						</button>
					</>
				) : (
					<Link
						href='/auth/sign-in'
						onClick={onClose}
						className='block w-full px-4 py-2 text-sm font-medium text-white bg-flutterwave-orange hover:bg-orange-600 rounded-lg transition-colors text-center'>
						Sign In
					</Link>
				)}
			</div>
		</div>
	)
}

interface NavLinkProps {
	href: string
	pathname: string
	children: React.ReactNode
}

function NavLink({ href, pathname, children }: NavLinkProps) {
	const isActive = pathname === href
	return (
		<Link
			href={href}
			className={`text-sm font-medium transition-colors ${
				isActive
					? 'text-flutterwave-orange'
					: 'text-gray-600 hover:text-flutterwave-dark'
			}`}>
			{children}
		</Link>
	)
}

interface MobileNavLinkProps extends NavLinkProps {
	onClick: () => void
}

function MobileNavLink({
	href,
	pathname,
	children,
	onClick
}: MobileNavLinkProps) {
	const isActive = pathname === href
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
				isActive
					? 'bg-orange-50 text-flutterwave-orange'
					: 'text-gray-600 hover:bg-gray-50'
			}`}>
			{children}
		</Link>
	)
}

interface UserAvatarProps {
	user: any
	size?: 'sm' | 'md' | 'lg'
}

function UserAvatar({ user, size = 'sm' }: UserAvatarProps) {
	const sizeClasses = {
		sm: 'h-8 w-8 text-sm',
		md: 'h-10 w-10 text-base',
		lg: 'h-12 w-12 text-lg'
	}

	return (
		<div
			className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0`}>
			{user?.user_metadata?.avatar_url ? (
				<img
					src={user.user_metadata.avatar_url}
					alt='User avatar'
					className='h-full w-full object-cover'
				/>
			) : (
				<span className='font-medium text-gray-600'>
					{user.email?.[0]?.toUpperCase()}
				</span>
			)}
		</div>
	)
}
