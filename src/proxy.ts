import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
	console.log('MIDDLEWARE HIT:', request.nextUrl.pathname)
	const pathname = request.nextUrl.pathname
	// 🔒 Absolute bypass for all API routes
	if (pathname.startsWith('/api')) {
		return NextResponse.next()
	}
	return await updateSession(request)
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
	]
}
