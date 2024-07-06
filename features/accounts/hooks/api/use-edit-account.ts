import { client } from '@/lib/hono';
import { AccountEditRequestType, AccountEditResponseType } from '@/types/accounts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useEditAccount() {
	const queryClient = useQueryClient();

	return useMutation<AccountEditResponseType, Error, AccountEditRequestType>({
		mutationFn: async ({ param, json }) => {
			const response = await client.api.accounts[':id']['$patch']({
				param,
				json,
			});

			if (!response.ok) {
				throw new Error('Failed to update account.');
			}

			return await response.json();
		},
		onSuccess: () => {
			toast.success('Account updated successfully!');
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
		},
		onError: () => {
			toast.error('Failed to update account.');
		},
	});
}
