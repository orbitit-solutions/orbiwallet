import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';
import { InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { accounts } from '@/test/fixtures/accounts';

export const accountHandlers = [
	http.get<
		PathParams,
		DefaultBodyType,
		InferResponseType<typeof client.api.accounts.$get>
	>(`${process.env.NEXT_PUBLIC_APP_URL}/api/accounts`, () => {
		return HttpResponse.json({ data: accounts });
	}),
];
