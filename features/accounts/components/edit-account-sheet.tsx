'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import EditAccountForm from './edit-account-form';
import { useAccount } from '../hooks/api/use-account';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface EditAccountSheetProps {
	accountId: number | undefined;
	isOpen: boolean;
	handleClose: () => void;
}

function EditAccountSheet({ accountId, isOpen, handleClose }: EditAccountSheetProps) {
	const {
		data: account,
		isLoading: isAccountLoading,
		error,
		isError,
	} = useAccount(accountId);

	return (
		<Sheet open={isOpen} onOpenChange={handleClose}>
			<SheetContent className="space-y-4">
				<SheetHeader>
					<SheetTitle>Edit Account</SheetTitle>
					<SheetDescription>Update your account information.</SheetDescription>
				</SheetHeader>
				{isAccountLoading ? (
					<LoadingSpinner />
				) : isError ? (
					<p className="text-red-600 font-semibold">{error.message}</p>
				) : account ? (
					<EditAccountForm
						accountId={accountId}
						onSuccess={handleClose}
						defaultValues={{ name: account.name }}
					/>
				) : (
					<p>Could not get account information.</p>
				)}
			</SheetContent>
		</Sheet>
	);
}

export default EditAccountSheet;
