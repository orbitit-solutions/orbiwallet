import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

import HeaderLogo from './header-logo';
import Navigation from './navigation';
import UserInfo from './user-info';
import RestrictiveContainer from '../container/restrictive-container';

function Header() {
	return (
		<header className="px-3 lg:px-10 py-6">
			<RestrictiveContainer>
				<div className="flex items-center justify-between gap-x-2">
					<HeaderLogo classes="hidden lg:inline-block" />
					<Navigation />
					<ClerkLoading>
						<Loader2 className="size-8 animate-spin text-brand-dark" />
					</ClerkLoading>
					<ClerkLoaded>
						<UserInfo />
					</ClerkLoaded>
				</div>
			</RestrictiveContainer>
		</header>
	);
}

export default Header;
