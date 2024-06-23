'use client';

import RestrictiveContainer from '@/components/container/restrictive-container';
import { DataTable } from '@/components/ui/data-table';
import CreateAccountSheet from '@/features/accounts/components/create-account-sheet';
import { columns } from './columns';
import { useAccounts } from '@/features/accounts/hooks/api/use-accounts';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useBulkDelete } from '@/features/accounts/hooks/api/use-bulk-delete';

function AccountsPage() {
	const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
	const { isPending: isDeleting, mutate: bulkDeleteMutate } = useBulkDelete();

	return (
		<RestrictiveContainer>
			<div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
				<h1 className=" font-bold text-2xl sm:text-3xl">Accounts</h1>
				<CreateAccountSheet />
			</div>
			{isAccountsLoading ? (
				<div className="flex items-center justify-center min-h-[300px]">
					<LoadingSpinner />
				</div>
			) : accounts && accounts.length > 0 ? (
				<DataTable
					columns={columns}
					data={accounts}
					filterKey="name"
					onDelete={rows => {
						const ids = rows.map(row => row.original.id);
						bulkDeleteMutate({ ids });
					}}
					disabled={isDeleting}
				/>
			) : (
				<p>There are no accounts to show.</p>
			)}
		</RestrictiveContainer>
	);
}

export default AccountsPage;
