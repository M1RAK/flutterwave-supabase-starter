'use client'
import { useState } from 'react'

export default function SetupBanner() {
	const [dismissed, setDismissed] = useState(false)
	const isTestMode = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.includes('TEST')

	if (!isTestMode || dismissed) return null

	return (
		<div className='bg-linear-to-r from-blue-600 to-purple-600 text-white'>
			<div className='max-w-7xl mx-auto px-4 py-3'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<svg
							className='w-5 h-5'
							fill='currentColor'
							viewBox='0 0 20 20'>
							<path
								fillRule='evenodd'
								d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
								clipRule='evenodd'
							/>
						</svg>
						<p className='text-sm font-medium'>
							🎉 You're in <strong>Demo Mode</strong> - Use test
							card:
							<code className='mx-2 px-2 py-1 bg-white/20 rounded text-xs'>
								5531886652142950
							</code>
							CVV: 564, Expiry: 09/32, PIN: 3310
						</p>
					</div>
					<button
						onClick={() => setDismissed(true)}
						className='text-white/80 hover:text-white'>
						<svg
							className='w-5 h-5'
							fill='currentColor'
							viewBox='0 0 20 20'>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}
