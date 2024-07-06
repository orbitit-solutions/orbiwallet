import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/(dashboard)/accounts/columns';
import { useAccounts } from '@/features/accounts/hooks/api/use-accounts';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useBulkDelete } from '@/features/accounts/hooks/api/use-bulk-delete';
import { useDeleteAccount } from '@/features/accounts/hooks/api/use-delete-account';

interface AccountsTableProps {
	onClickEdit?: (id: number) => void;
}

function AccountsTable({ onClickEdit }: AccountsTableProps) {
	const { data: accounts, isLoading: isAccountsLoading, isError, error } = useAccounts();
	const { isPending: isBulkDeleting, mutate: bulkDeleteMutate } = useBulkDelete();
	const { mutate: deleteMutate } = useDeleteAccount();

	return (
		<>
			{isAccountsLoading ? (
				<div className="flex items-center justify-center min-h-[300px]">
					<LoadingSpinner />
				</div>
			) : isError ? (
				<p className="text-center min-h-[65vh] flex items-center justify-center text-red-600 font-semibold">
					{error.message}
				</p>
			) : accounts && accounts.length > 0 ? (
				<DataTable
					columns={columns}
					data={accounts}
					tableCaption="A list of your accounts"
					filterKey="name"
					disabled={isBulkDeleting}
					onBulkDelete={rows => {
						const ids = rows.map(row => row.original.id);
						bulkDeleteMutate({ ids });
					}}
					onDelete={(id: number) => {
						deleteMutate({ id: id.toString() });
					}}
					onClickEdit={onClickEdit}
				/>
			) : (
				<p className="text-center min-h-[65vh] flex items-center justify-center">
					You do not have any accounts. Create an account to start tracking your
					transactions.
				</p>
			)}
		</>
	);
}

export default AccountsTable;
