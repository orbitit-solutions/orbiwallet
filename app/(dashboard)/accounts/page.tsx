'use client';

import RestrictiveContainer from '@/components/container/restrictive-container';
import AccountsTable from '@/features/accounts/components/accounts-table';
import CreateAccountSheet from '@/features/accounts/components/create-account-sheet';
import EditAccountSheet from '@/features/accounts/components/edit-account-sheet';
import { useSelectedId } from '@/hooks/use-selected-id';

function AccountsPage() {
	const { selectedId, isSelectedId, unsetId, setId } = useSelectedId();
	return (
		<RestrictiveContainer>
			<EditAccountSheet
				accountId={selectedId}
				isOpen={isSelectedId}
				handleClose={unsetId}
			/>
			<div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
				<h1 className=" font-bold text-2xl sm:text-3xl">Accounts</h1>
				<CreateAccountSheet />
			</div>
			<AccountsTable onClickEdit={setId} />
		</RestrictiveContainer>
	);
}

export default AccountsPage;
