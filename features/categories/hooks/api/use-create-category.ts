import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/lib/hono';
import {
	CategoryCreateRequestType,
	CategoryCreateResponseType,
} from '@/types/categories';

export function useCreateCategory() {
	const queryClient = useQueryClient();
	return useMutation<
		CategoryCreateResponseType,
		Error,
		CategoryCreateRequestType['json']
	>({
		mutationFn: async data => {
			const response = await client.api.categories.$post({ json: data });
			return await response.json();
		},
		onSuccess: () => {
			toast.success('Category created successfully!');
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
		onError: () => {
			toast.error('Failed to create a category.');
		},
	});
}
