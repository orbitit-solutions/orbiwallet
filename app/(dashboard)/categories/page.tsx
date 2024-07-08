import RestrictiveContainer from '@/components/container/restrictive-container';
import CategoriesTable from '@/features/categories/components/categories-table';

function CategoriesPage() {
	return (
		<RestrictiveContainer>
			<div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
				<h1 className=" font-bold text-2xl sm:text-3xl">Categories</h1>
			</div>
			<CategoriesTable />
		</RestrictiveContainer>
	);
}

export default CategoriesPage;
