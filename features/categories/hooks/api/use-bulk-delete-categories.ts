import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import {
	CategoriesBulkDeleteRequestType,
	CategoriesBulkDeleteResponseType,
} from '@/types/categories';

export function useBulkDeleteCategories() {
	const queryClient = useQueryClient();
	return useMutation<
		CategoriesBulkDeleteResponseType,
		Error,
		CategoriesBulkDeleteRequestType['json']
	>({
		mutationFn: async data => {
			const response = await client.api.categories['bulk-delete']['$post']({
				json: data,
			});
			return await response.json();
		},
		onSuccess: ({ data }) => {
			toast.success(
				`${data.length > 1 ? 'Categories' : 'Category'} deleted successfully!`,
			);
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: (_error, { ids }) => {
			toast.error(`Failed to delete ${ids.length > 1 ? 'categories' : 'category'}.`);
		},
	});
}
