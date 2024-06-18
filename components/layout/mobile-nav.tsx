'use client';

import { usePathname } from 'next/navigation';
import { useToggle } from 'react-use';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import HeaderLogo from './header-logo';
import NavButton from './nav-button';

interface MobileNavProps {
	links: { href: string; label: string }[];
}

function MobileNav({ links }: MobileNavProps) {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useToggle(false);
	return (
		<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
			<SheetTrigger asChild className="lg:hidden">
				<Button>
					<Menu className="mr-2 w-4 h-4" />
					Menu
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="px-3 lg:hidden">
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
									onClick={() => {
										setIsMenuOpen(false);
									}}
								/>
							</li>
						))}
					</ul>
				</nav>
			</SheetContent>
		</Sheet>
	);
}

export default MobileNav;
