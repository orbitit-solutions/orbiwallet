import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export function useAccount(id: number | undefined) {
	return useQuery({
		enabled: !!id,
		queryKey: ['accounts', id],
		queryFn: async () => {
			try {
				const response = await client.api.accounts[':id'].$get({
					param: { id: id?.toString() },
				});

				if (!response.ok) {
					throw new Error('Failed to fetch account. Please try again later.');
				}

				const { data } = await response.json();

				return data;
			} catch {
				throw new Error('Failed to fetch account. Please try again later.');
			}
		},
	});
}
