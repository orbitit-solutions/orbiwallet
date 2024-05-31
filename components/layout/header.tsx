import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

import HeaderLogo from './header-logo';
import Navigation from './navigation';
import UserInfo from './user-info';

function Header() {
	return (
		<header className="px-4 lg:px-14 py-6">
			<div className="max-w-screen-2xl mx-auto">
				<div className="flex items-center justify-between">
					<div className="flex items-center lg:gap-x-16">
						<HeaderLogo classes="hidden lg:inline-block" />
						<Navigation />
					</div>
					<ClerkLoading>
						<Loader2 className="size-8 animate-spin text-brand-dark" />
					</ClerkLoading>
					<ClerkLoaded>
						<UserInfo />
					</ClerkLoaded>
				</div>
			</div>
		</header>
	);
}

export default Header;
