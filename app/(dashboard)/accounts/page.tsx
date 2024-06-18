'use client';

import RestrictiveContainer from '@/components/container/restrictive-container';
import { DataTable } from '@/components/ui/data-table';
import CreateAccountSheet from '@/features/accounts/components/create-account-sheet';
import { columns } from './columns';
import { useAccounts } from '@/features/accounts/hooks/api/use-accounts';
import LoadingSpinner from '@/components/ui/loading-spinner';

function AccountsPage() {
	const { data: accounts, isLoading, isError, error } = useAccounts();

	return (
		<RestrictiveContainer>
			<div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
				<h1 className=" font-bold text-2xl sm:text-3xl">Accounts</h1>
				<CreateAccountSheet />
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center min-h-[300px]">
					<LoadingSpinner />
				</div>
			) : isError ? (
				<p>{error.message}</p>
			) : accounts && accounts.length > 0 ? (
				<DataTable
					columns={columns}
					data={accounts}
					filterKey="name"
					onDelete={() => {}}
				/>
			) : (
				<p>There are no accounts to show.</p>
			)}
		</RestrictiveContainer>
	);
}

export default AccountsPage;
