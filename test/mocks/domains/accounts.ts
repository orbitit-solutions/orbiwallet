import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';

import { accounts } from '@/test/fixtures/accounts';
import { ACCOUNTS_BASE_URL } from '@/utils/constants';
import {
	AccountBulkDeleteRequestType,
	AccountBulkDeleteResponseType,
	AccountCreateRequestType,
	AccountCreateResponseType,
	AccountDeleteRequestType,
	AccountDeleteResponseType,
	AccountEditRequestType,
	AccountEditResponseType,
	AccountGetResponseType,
	AccountsGetResponseType,
} from '@/types/accounts';

export const accountHandlers = [
	http.get<PathParams, DefaultBodyType, AccountsGetResponseType>(
		ACCOUNTS_BASE_URL,
		() => {
			return HttpResponse.json({ data: accounts });
		},
	),
	http.get<{ id: string }, DefaultBodyType, AccountGetResponseType>(
		`${ACCOUNTS_BASE_URL}/:id`,
		({ params }) => {
			const id = Number.parseFloat(params.id);

			const account = accounts.find(account => account.id === id);

			if (!account) {
				return HttpResponse.json({ error: 'Account not found' }, { status: 404 });
			}

			return HttpResponse.json({ data: account });
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
	http.delete<{ id: string }, DefaultBodyType, AccountDeleteResponseType>(
		`${ACCOUNTS_BASE_URL}/:id`,
		async ({ params }) => {
			const id = Number.parseFloat(params.id);
			const account = accounts.find(account => account.id === id);

			if (!account) {
				return HttpResponse.json({ error: 'Account not found' }, { status: 404 });
			}

			return HttpResponse.json({ data: { id: account.id } });
		},
	),
	http.patch<{ id: string }, AccountEditRequestType['json'], AccountEditResponseType>(
		`${ACCOUNTS_BASE_URL}/:id`,
		async ({ request, params }) => {
			const id = Number.parseFloat(params.id);
			const body = await request.json();

			const account = accounts.find(account => account.id === id);

			if (!account) {
				return HttpResponse.json({ error: 'Account not found' }, { status: 404 });
			}

			const updatedPost = { ...account, name: body.name };

			return HttpResponse.json({ data: updatedPost });
		},
	),
];
