'use client';

import { useToggle } from 'react-use';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import CreateCategoryForm from './create-category-form';
import { Plus } from 'lucide-react';

function CreateCategorySheet() {
	const [isOpen, setOpen] = useToggle(false);

	return (
		<Sheet open={isOpen} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button>
					<Plus className="mr-1 size-4" aria-hidden="true" /> New Category
				</Button>
			</SheetTrigger>
			<SheetContent className="space-y-4">
				<SheetHeader>
					<SheetTitle>Create Category</SheetTitle>
					<SheetDescription>
						Create a category to organize your transactions.
					</SheetDescription>
				</SheetHeader>
				<CreateCategoryForm onSuccess={() => setOpen(false)} />
			</SheetContent>
		</Sheet>
	);
}

export default CreateCategorySheet;
