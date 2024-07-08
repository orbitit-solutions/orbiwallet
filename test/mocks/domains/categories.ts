import { DefaultBodyType, http, HttpResponse, PathParams } from 'msw';

import { categories } from '@/test/fixtures/categories';
import { CategoriesGetResponseType } from '@/types/categories';
import { CATEGORIES_BASE_URL } from '@/utils/constants';

export const categoryHandlers = [
	http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
		CATEGORIES_BASE_URL,
		() => {
			return HttpResponse.json({ data: categories });
		},
	),
];
