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

import { insertAccountSchema } from '@/db/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditAccount } from '../hooks/api/use-edit-account';

const formSchema = insertAccountSchema.pick({ name: true });

type FormData = z.infer<typeof formSchema>;

interface EditAccountFormProps {
	accountId: number | undefined;
	onSuccess?: () => void;
	defaultValues: FormData;
}

function EditAccountForm({ accountId, onSuccess, defaultValues }: EditAccountFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const formErrors = form.formState.errors;

	const mutation = useEditAccount(accountId);

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
				aria-labelledby="editAccountFormLabel"
				noValidate
			>
				<span className="sr-only" id="editAccountFormLabel">
					Edit Account
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
					{mutation.isPending ? <Loader2 /> : 'Edit account'}
				</Button>
			</form>
		</Form>
	);
}

export default EditAccountForm;
