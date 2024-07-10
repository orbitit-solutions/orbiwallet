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
import { useCreateCategory } from '../hooks/api/use-create-category';

const formSchema = insertCategorySchema.pick({ name: true });

type FormData = z.infer<typeof formSchema>;

interface CreateCategoryFormProps {
	onSuccess?: () => void;
}

function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const formErrors = form.formState.errors;

	const mutation = useCreateCategory();

	function onSubmit(formData: FormData) {
		mutation.mutate(formData, {
			onSuccess: () => {
				onSuccess?.();
			},
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				aria-labelledby="createCategoryFormLabel"
				noValidate
			>
				<span className="sr-only" id="createCategoryFormLabel">
					Create Category
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
									placeholder="e.g. Cash, Checking, Credit Card"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" disabled={mutation.isPending}>
					{mutation.isPending ? <Loader2 /> : 'Create category'}
				</Button>
			</form>
		</Form>
	);
}

export default CreateCategoryForm;
