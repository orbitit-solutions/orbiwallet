import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/']);

export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) auth().protect();
	return NextResponse.next();
});

export const config = {
	// The following matcher runs middleware on all routes except static assets
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
