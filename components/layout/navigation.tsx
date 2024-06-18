'use client';

import { usePathname } from 'next/navigation';
import NavButton from './nav-button';
import MobileNav from './mobile-nav';

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

	return (
		<>
			<MobileNav links={links} />
			<nav className="hidden lg:block">
				<ul className="flex gap-x-2">
					{links.map(link => (
						<li key={link.href}>
							<NavButton link={link} isActive={pathname === link.href} />
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

export default Navigation;
