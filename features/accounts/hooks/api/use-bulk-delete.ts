import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
	(typeof client.api.accounts)['bulk-delete']['$post']
>;

type RequestType = InferRequestType<
	(typeof client.api.accounts)['bulk-delete']['$post']
>['json'];

export function useBulkDelete() {
	const queryClient = useQueryClient();

	return useMutation<ResponseType, Error, RequestType>({
		mutationFn: async data => {
			const response = await client.api.accounts['bulk-delete']['$post']({ json: data });
			return await response.json();
		},
		onSuccess: ({ data }) => {
			toast.success(`Account${data.length > 1 ? 's' : ''} deleted successfully!`);
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
		},
		onError: error => {
			toast.error(error.message);
		},
	});
}
