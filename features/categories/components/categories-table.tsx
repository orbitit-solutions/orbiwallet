'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/(dashboard)/categories/columns';
import { useCategories } from '@/features/categories/hooks/api/use-categories';
import { useBulkDeleteCategories } from '../hooks/api/use-bulk-delete-categories';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface CategoriesTableProps {
	onClickEdit: (id: number) => void;
}

function CategoriesTable({ onClickEdit }: CategoriesTableProps) {
	const {
		data: categories,
		isLoading: isCategoriesLoading,
		isError,
		error,
	} = useCategories();
	const { isPending: isBulkDeleting, mutate: bulkDeleteMutate } =
		useBulkDeleteCategories();

	return (
		<>
			{isCategoriesLoading ? (
				<div className="flex items-center justify-center min-h-[300px]">
					<LoadingSpinner />
				</div>
			) : isError ? (
				<p className="text-center min-h-[65vh] flex items-center justify-center text-red-600 font-semibold">
					{error.message}
				</p>
			) : categories && categories.length > 0 ? (
				<DataTable
					columns={columns}
					data={categories}
					tableCaption="A list of your categories"
					filterKey="name"
					disabled={isBulkDeleting}
					onBulkDelete={rows => {
						const ids = rows.map(row => row.original.id);
						bulkDeleteMutate({ ids });
					}}
					onDelete={() => {}}
					onClickEdit={onClickEdit}
				/>
			) : (
				<p className="text-center min-h-[65vh] flex items-center justify-center">
					You do not have any categories. Create some categories to organize your
					transactions.
				</p>
			)}
		</>
	);
}

export default CategoriesTable;
