import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';

import { categories } from '@/test/fixtures/categories';
import {
	CategoriesGetResponseType,
	CategoryCreateRequestType,
	CategoryCreateResponseType,
} from '@/types/categories';
import { CATEGORIES_BASE_URL } from '@/utils/constants';

export const categoryHandlers = [
	http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
		CATEGORIES_BASE_URL,
		() => {
			return HttpResponse.json({ data: categories });
		},
	),
	http.post<PathParams, CategoryCreateRequestType['json'], CategoryCreateResponseType>(
		CATEGORIES_BASE_URL,
		async ({ request }) => {
			const body = await request.json();
			const newPost = {
				id: categories.length + 1,
				name: body.name,
				userId: 'test',
				plaidId: null,
				createdAt: new Date().toISOString(),
			};

			return HttpResponse.json({ data: newPost }, { status: 201 });
		},
	),
];
