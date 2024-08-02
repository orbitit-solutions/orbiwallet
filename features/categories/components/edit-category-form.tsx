import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { insertCategorySchema } from '@/db/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditCategory } from '../hooks/api/use-edit-category';

const formSchema = insertCategorySchema.pick({ name: true });

type FormData = z.infer<typeof formSchema>;

interface EditCategoryFormProps {
	categoryId: number | undefined;
	onSuccess?: () => void;
	defaultValues: FormData;
}

function EditCategoryForm({
	categoryId,
	onSuccess,
	defaultValues,
}: EditCategoryFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const formErrors = form.formState.errors;

	const mutation = useEditCategory();

	function onSubmit(formData: FormData) {
		mutation.mutate(
			{ param: { id: categoryId?.toString() }, json: formData },
			{
				onSuccess: () => {
					onSuccess?.();
				},
			},
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				aria-labelledby="editCategoryFormLabel"
				noValidate
			>
				<span className="sr-only" id="editCategoryFormLabel">
					Edit Category
				</span>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={mutation.isPending}
									aria-invalid={formErrors.name ? 'true' : 'false'}
									placeholder="e.g. Groceries, Shopping, Utilities, etc."
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" disabled={mutation.isPending}>
					{mutation.isPending ? <Loader2 /> : 'Edit category'}
				</Button>
			</form>
		</Form>
	);
}

export default EditCategoryForm;
