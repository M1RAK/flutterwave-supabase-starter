import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')
	const origin = requestUrl.origin

	if (code) {
		const cookieStore = await cookies()

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll()
					},
					setAll(cookiesToSet) {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						)
					}
				}
			}
		)

		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (!error) {
			const {
				data: { user }
			} = await supabase.auth.getUser()

			if (user) {
				// Create user profile
				const { data: existing } = await supabase
					.from('users')
					.select('id')
					.eq('id', user.id)
					.maybeSingle()

				if (!existing) {
					await supabase.from('users').insert({
						id: user.id,
						email: user.email!,
						full_name:
							user.user_metadata?.full_name ||
							user.user_metadata?.name
					})
				}
			}

			return NextResponse.redirect(`${origin}/subscription`)
		}
	}

	// Redirect to error page
	return NextResponse.redirect(`${origin}/auth/signin`)
}
