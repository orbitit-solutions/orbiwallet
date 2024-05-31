'use client';

import { usePathname } from 'next/navigation';
import { useMedia } from 'react-use';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NavButton from './nav-button';
import HeaderLogo from './header-logo';

const links = [
	{
		href: '/',
		label: 'Overview',
	},
	{
		href: '/transactions',
		label: 'Transactions',
	},
	{
		href: '/accounts',
		label: 'Accounts',
	},
	{
		href: '/categories',
		label: 'Categories',
	},
	{
		href: '/settings',
		label: 'Settings',
	},
];

function Navigation() {
	const pathname = usePathname();
	const isMobile = useMedia('(max-width: 1023px)', false);

	if (isMobile) {
		return (
			<Sheet>
				<SheetTrigger asChild>
					<Button>
						<Menu className="mr-2 w-4 h-4" />
						Menu
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="px-3">
					<SheetHeader className="py-4">
						<HeaderLogo />
					</SheetHeader>
					<nav>
						<ul className="space-y-2">
							{links.map(link => (
								<li key={link.href}>
									<NavButton
										link={link}
										isActive={pathname === link.href}
										classes="w-full flex justify-start"
									/>
								</li>
							))}
						</ul>
					</nav>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<nav className="hidden lg:block">
			<ul className="flex gap-x-2">
				{links.map(link => (
					<li key={link.href}>
						<NavButton link={link} isActive={pathname === link.href} />
					</li>
				))}
			</ul>
		</nav>
	);
}

export default Navigation;
