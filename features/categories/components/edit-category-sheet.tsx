'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import EditCategoryForm from './edit-category-form';
import { useCategory } from '../hooks/api/use-category';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface EditCategorySheetProps {
	categoryId: number | undefined;
	isOpen: boolean;
	handleClose: () => void;
}

function EditCategorySheet({ categoryId, isOpen, handleClose }: EditCategorySheetProps) {
	const {
		data: category,
		isLoading: isCategoryLoading,
		error,
		isError,
	} = useCategory(categoryId);

	return (
		<Sheet open={isOpen} onOpenChange={handleClose}>
			<SheetContent className="space-y-4">
				<SheetHeader>
					<SheetTitle>Edit Category</SheetTitle>
					<SheetDescription>Update your category information.</SheetDescription>
				</SheetHeader>
				{isCategoryLoading ? (
					<LoadingSpinner />
				) : isError ? (
					<p className="text-red-600 font-semibold">{error.message}</p>
				) : category ? (
					<EditCategoryForm
						categoryId={categoryId}
						onSuccess={handleClose}
						defaultValues={{ name: category.name }}
					/>
				) : (
					<p>Could not get category information.</p>
				)}
			</SheetContent>
		</Sheet>
	);
}

export default EditCategorySheet;
