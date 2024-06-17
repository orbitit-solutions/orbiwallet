'use client';

import { useToggle } from 'react-use';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import CreateAccountForm from './create-account-form';

function CreateAccountSheet() {
	const [isOpen, setOpen] = useToggle(false);

	return (
		<Sheet open={isOpen} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button>Create account</Button>
			</SheetTrigger>
			<SheetContent className="space-y-4">
				<SheetHeader>
					<SheetTitle>Create Account</SheetTitle>
					<SheetDescription>
						Create an account to start tracking your transactions.
					</SheetDescription>
				</SheetHeader>
				<CreateAccountForm onSuccess={() => setOpen(false)} />
			</SheetContent>
		</Sheet>
	);
}

export default CreateAccountSheet;
