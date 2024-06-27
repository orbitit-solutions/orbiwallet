import { InferResponseType } from 'hono';

import { client } from '@/lib/hono';

export const accounts: InferResponseType<typeof client.api.accounts.$get>['data'] = [
	{ id: 1, name: 'Test 1' },
	{ id: 2, name: 'Test 2' },
];
