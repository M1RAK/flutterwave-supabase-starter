import { useState, useEffect, useMemo } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const supabase = useMemo(() => createClient(), [])

	useEffect(() => {
		// Get initial session
		const initAuth = async () => {
			const {
				data: { user }
			} = await supabase.auth.getUser()
			setUser(user)
			setLoading(false)
		}

		initAuth()

		// Subscribe to auth changes
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => subscription.unsubscribe()
	}, [])

	const signOut = async () => {
		await supabase.auth.signOut()
		setUser(null)
	}

	const ensureUserProfile = async (
		userId: string,
		email: string,
		fullName?: string
	) => {
		const { data: profile } = await supabase
			.from('users')
			.select('*')
			.eq('id', userId)
			.single()

		if (!profile) {
			await supabase.from('users').insert({
				id: userId,
				email,
				full_name: fullName
			})
		}
	}

	return {
		user,
		loading,
		signOut,
		ensureUserProfile,
		isAuthenticated: !!user
	}
}
