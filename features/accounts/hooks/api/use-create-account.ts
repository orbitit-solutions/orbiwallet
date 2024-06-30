import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import { AccountCreateRequestType, AccountCreateResponseType } from '@/types/accounts';

export function useCreateAccount() {
	const queryClient = useQueryClient();

	return useMutation<AccountCreateResponseType, Error, AccountCreateRequestType['json']>({
		mutationFn: async data => {
			const response = await client.api.accounts.$post({ json: data });
			return await response.json();
		},
		onSuccess: () => {
			toast.success('Account created successfully!');
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
		},
		onError: () => {
			toast.error('Failed to create an account.');
		},
	});
}
