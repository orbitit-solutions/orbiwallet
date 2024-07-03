import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

export type AccountsGetResponseType = InferResponseType<typeof client.api.accounts.$get>;

export type AccountGetResponseType = InferResponseType<
	(typeof client.api.accounts)[':id']['$get']
>;

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

export type AccountEditRequestType = InferRequestType<
	(typeof client.api.accounts)[':id']['$patch']
>;

export type AccountEditResponseType = InferResponseType<
	(typeof client.api.accounts)[':id']['$patch']
>;
