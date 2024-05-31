import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/orbiwallet_logo.png';
import { cn } from '@/lib/utils';

interface HeaderLogoProps {
	classes?: string;
}

function HeaderLogo({ classes }: HeaderLogoProps) {
	return (
		<Link
			href="/"
			className={cn(
				'rounded-md outline-none focus-visible:outline-brand-dark focus-visible:outline-offset-4',
				classes ? classes : '',
			)}
		>
			<Image src={logo} alt="OrbiWallet logo" className="max-w-[200px]" />
		</Link>
	);
}

export default HeaderLogo;
