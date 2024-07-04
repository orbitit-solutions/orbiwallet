import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import { AccountDeleteRequestType, AccountDeleteResponseType } from '@/types/accounts';

export function useDeleteAccount() {
	const queryClient = useQueryClient();
	return useMutation<AccountDeleteResponseType, Error, AccountDeleteRequestType['param']>(
		{
			mutationFn: async data => {
				const response = await client.api.accounts[':id']['$delete']({
					param: { id: data.id },
				});

				if (!response.ok) {
					throw new Error('Failed to delete account.');
				}

				return await response.json();
			},
			onSuccess: () => {
				toast.success('Account deleted successfully!');
				queryClient.invalidateQueries({ queryKey: ['accounts'] });
			},
			onError: () => {
				toast.error('Failed to delete account.');
			},
		},
	);
}
