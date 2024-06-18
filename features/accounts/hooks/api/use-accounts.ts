import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export function useAccounts() {
	return useQuery({
		queryKey: ['accounts'],
		queryFn: async () => {
			const response = await client.api.accounts.$get();

			if (!response.ok) {
				throw new Error('Failed to fetch accounts. Please try again later.');
			}

			const { data } = await response.json();

			return data;
		},
	});
}
