import { UserButton } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<main>
			<UserButton />
			<h1>Hello World</h1>
			<Button>Click me!</Button>
		</main>
	);
}
