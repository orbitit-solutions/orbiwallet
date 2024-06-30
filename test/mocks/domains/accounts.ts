import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';

import { accounts } from '@/test/fixtures/accounts';
import { ACCOUNTS_BASE_URL } from '@/utils/constants';
import {
	AccountBulkDeleteRequestType,
	AccountBulkDeleteResponseType,
	AccountCreateRequestType,
	AccountCreateResponseType,
	AccountsGetResponseType,
} from '@/types/accounts';

export const accountHandlers = [
	http.get<PathParams, DefaultBodyType, AccountsGetResponseType>(
		ACCOUNTS_BASE_URL,
		() => {
			return HttpResponse.json({ data: accounts });
		},
	),
	http.post<PathParams, AccountCreateRequestType['json'], AccountCreateResponseType>(
		ACCOUNTS_BASE_URL,
		async ({ request }) => {
			const body = await request.json();
			const newPost = {
				id: accounts.length + 1,
				name: body.name,
				userId: 'test',
				plaidId: null,
				createdAt: new Date().toISOString(),
			};

			return HttpResponse.json({ data: newPost }, { status: 201 });
		},
	),
	http.post<
		PathParams,
		AccountBulkDeleteRequestType['json'],
		AccountBulkDeleteResponseType
	>(`${ACCOUNTS_BASE_URL}/bulk-delete`, async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json({ data: body.ids.map(id => ({ id })) });
	}),
];
