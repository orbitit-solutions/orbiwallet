import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';

import { categories } from '@/test/fixtures/categories';
import {
	CategoriesBulkDeleteRequestType,
	CategoriesBulkDeleteResponseType,
	CategoriesGetResponseType,
	CategoryCreateRequestType,
	CategoryCreateResponseType,
	CategoryEditRequestType,
	CategoryEditResponseType,
	CategoryGetResponseType,
} from '@/types/categories';
import { CATEGORIES_BASE_URL } from '@/utils/constants';

export const categoryHandlers = [
	http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
		CATEGORIES_BASE_URL,
		() => {
			return HttpResponse.json({ data: categories });
		},
	),
	http.get<{ id: string }, DefaultBodyType, CategoryGetResponseType>(
		`${CATEGORIES_BASE_URL}/:id`,
		({ params }) => {
			const id = Number.parseFloat(params.id);
			const category = categories.find(category => category.id === id);

			if (!category) {
				return HttpResponse.json({ error: 'Category not found' }, { status: 404 });
			}

			return HttpResponse.json({ data: category });
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
	http.post<
		PathParams,
		CategoriesBulkDeleteRequestType['json'],
		CategoriesBulkDeleteResponseType
	>(`${CATEGORIES_BASE_URL}/bulk-delete`, async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json({ data: body.ids.map(id => ({ id })) });
	}),
	http.patch<{ id: string }, CategoryEditRequestType['json'], CategoryEditResponseType>(
		`${CATEGORIES_BASE_URL}/:id`,
		async ({ request, params }) => {
			const id = Number.parseFloat(params.id);
			const body = await request.json();
			const category = categories.find(category => category.id === id);

			if (!category) {
				return HttpResponse.json({ error: 'Category not found' }, { status: 404 });
			}

			const updatedCategory = { ...category, name: body.name };

			return HttpResponse.json({ data: updatedCategory });
		},
	),
];
