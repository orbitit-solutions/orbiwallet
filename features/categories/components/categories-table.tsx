'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/(dashboard)/categories/columns';
import { useCategories } from '@/features/categories/hooks/api/use-categories';
import LoadingSpinner from '@/components/ui/loading-spinner';

function CategoriesTable() {
	const {
		data: categories,
		isLoading: isCategoriesLoading,
		isError,
		error,
	} = useCategories();

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
					disabled={false}
					onBulkDelete={() => {}}
					onDelete={() => {}}
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
