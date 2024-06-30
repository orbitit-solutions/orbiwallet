import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import {
	AccountBulkDeleteRequestType,
	AccountBulkDeleteResponseType,
} from '@/types/accounts';

export function useBulkDelete() {
	const queryClient = useQueryClient();

	return useMutation<
		AccountBulkDeleteResponseType,
		Error,
		AccountBulkDeleteRequestType['json']
	>({
		mutationFn: async data => {
			const response = await client.api.accounts['bulk-delete']['$post']({ json: data });
			return await response.json();
		},
		onSuccess: ({ data }) => {
			toast.success(`Account${data.length > 1 ? 's' : ''} deleted successfully!`);
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
		},
		onError: (_error, variables) => {
			toast.error(`Failed to delete account${variables.ids.length > 1 ? 's' : ''}.`);
		},
	});
}
