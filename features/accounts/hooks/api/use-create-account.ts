import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>['json'];

export function useCreateAccount() {
	const queryClient = useQueryClient();

	return useMutation<ResponseType, Error, RequestType>({
		mutationFn: async data => {
			const response = await client.api.accounts.$post({ json: data });
			return await response.json();
		},
		onSuccess: () => {
			toast.success('Account created successfully!');
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
		},
		onError: error => {
			toast.error(error.message);
		},
	});
}
