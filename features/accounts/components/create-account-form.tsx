import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useCreateAccount } from '../hooks/api/use-create-account';
import { Loader2 } from 'lucide-react';

const formSchema = insertAccountSchema.pick({ name: true });

type FormData = z.infer<typeof formSchema>;

interface CreateAccountFormProps {
	onSuccess?: () => void;
}

function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const formErrors = form.formState.errors;

	const mutation = useCreateAccount();

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
				aria-labelledby="createAccountFormLabel"
				noValidate
			>
				<span className="sr-only" id="createAccountFormLabel">
					Create Account
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
					{mutation.isPending ? <Loader2 /> : 'Create account'}
				</Button>
			</form>
		</Form>
	);
}

export default CreateAccountForm;
