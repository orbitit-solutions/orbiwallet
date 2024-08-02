'use client';

import RestrictiveContainer from '@/components/container/restrictive-container';
import CategoriesTable from '@/features/categories/components/categories-table';
import CreateCategorySheet from '@/features/categories/components/create-category-sheet';
import EditCategorySheet from '@/features/categories/components/edit-category-sheet';
import { useSelectedId } from '@/hooks/use-selected-id';

function CategoriesPage() {
	const { selectedId, isSelectedId, unsetId, setId } = useSelectedId();
	return (
		<RestrictiveContainer>
			<EditCategorySheet
				categoryId={selectedId}
				isOpen={isSelectedId}
				handleClose={unsetId}
			/>
			<div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
				<h1 className=" font-bold text-2xl sm:text-3xl">Categories</h1>
				<CreateCategorySheet />
			</div>
			<CategoriesTable onClickEdit={setId} />
		</RestrictiveContainer>
	);
}

export default CategoriesPage;
