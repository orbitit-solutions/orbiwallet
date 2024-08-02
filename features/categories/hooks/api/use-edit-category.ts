import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import { CategoryEditRequestType, CategoryEditResponseType } from '@/types/categories';

export function useEditCategory() {
	const queryClient = useQueryClient();

	return useMutation<CategoryEditResponseType, Error, CategoryEditRequestType>({
		mutationFn: async ({ param, json }) => {
			const response = await client.api.categories[':id'].$patch({ param, json });

			if (!response.ok) {
				throw new Error('Failed to update category.');
			}

			return await response.json();
		},
		onSuccess: () => {
			toast.success('Category updated successfully!');
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: () => {
			toast.error('Failed to update category.');
		},
	});
}
