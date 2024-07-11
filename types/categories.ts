import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

export type CategoriesGetResponseType = InferResponseType<
	typeof client.api.categories.$get
>;

export type CategoryCreateRequestType = InferRequestType<
	typeof client.api.categories.$post
>;

export type CategoryCreateResponseType = InferResponseType<
	typeof client.api.categories.$post
>;

export type CategoriesBulkDeleteRequestType = InferRequestType<
	(typeof client.api.categories)['bulk-delete']['$post']
>;

export type CategoriesBulkDeleteResponseType = InferResponseType<
	(typeof client.api.categories)['bulk-delete']['$post']
>;
