import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export function useCategories() {
	return useQuery({
		queryKey: ['categories'],
		queryFn: async () => {
			try {
				const response = await client.api.categories.$get();

				if (!response.ok) {
					throw new Error('Failed to fetch categories. Please try again later.');
				}

				const { data } = await response.json();
				return data;
			} catch {
				throw new Error('Failed to fetch categories. Please try again later.');
			}
		},
	});
}
