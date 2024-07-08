import { InferResponseType } from 'hono';

import { client } from '@/lib/hono';

export type CategoriesGetResponseType = InferResponseType<
	typeof client.api.categories.$get
>;
