import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

function SignUpPage() {
	return (
		<div className="my-min-h-svh grid items-center justify-center bg-gradient-to-br from-brand-light to-brand-dark">
			<ClerkLoaded>
				<SignUp path="/sign-up" />
			</ClerkLoaded>
			<ClerkLoading>
				<Loader2 className="animate-spin text-slate-200" />
			</ClerkLoading>
		</div>
	);
}

export default SignUpPage;
