import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

export type AccountsGetResponseType = InferResponseType<typeof client.api.accounts.$get>;

export type AccountCreateRequestType = InferRequestType<typeof client.api.accounts.$post>;

export type AccountCreateResponseType = InferResponseType<
	typeof client.api.accounts.$post
>;

export type AccountBulkDeleteRequestType = InferRequestType<
	(typeof client.api.accounts)['bulk-delete']['$post']
>;

export type AccountBulkDeleteResponseType = InferResponseType<
	(typeof client.api.accounts)['bulk-delete']['$post']
>;
