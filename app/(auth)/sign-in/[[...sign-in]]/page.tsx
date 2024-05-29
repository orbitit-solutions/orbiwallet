import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

function SignInPage() {
	return (
		<div className="my-min-h-svh grid items-center justify-center bg-gradient-to-br from-brand-light to-brand-dark">
			<ClerkLoaded>
				<SignIn path="/sign-in" />
			</ClerkLoaded>
			<ClerkLoading>
				<Loader2 className="animate-spin text-slate-200" />
			</ClerkLoading>
		</div>
	);
}

export default SignInPage;
