import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export function useCategory(id: number | undefined) {
	return useQuery({
		enabled: !!id,
		queryKey: ['categories', id],
		queryFn: async () => {
			try {
				const response = await client.api.categories[':id'].$get({
					param: { id: id?.toString() },
				});

				if (!response.ok) {
					throw new Error('Failed to fetch category. Please try again later.');
				}

				const { data } = await response.json();

				return data;
			} catch {
				throw new Error('Failed to fetch category. Please try again later.');
			}
		},
	});
}
