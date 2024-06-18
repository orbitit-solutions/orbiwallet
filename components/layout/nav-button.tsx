import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavButtonProps {
	link: { href: string; label: string };
	isActive?: boolean;
	classes?: string;
	onClick?: () => void;
}

function NavButton({ link, isActive, classes, onClick }: NavButtonProps) {
	return (
		<Button
			asChild
			variant="outline"
			className={cn(
				'w-full flex justify-start border-none hover:bg-brand-dark/20 transition',
				classes ? classes : '',
				isActive && 'bg-brand-dark/20',
			)}
		>
			<Link href={link.href} {...(onClick && { onClick })}>
				{link.label}
			</Link>
		</Button>
	);
}

export default NavButton;
