import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultBodyType, HttpResponse, PathParams, http } from 'msw';

import CategoriesPage from '@/app/(dashboard)/categories/page';
import { categories } from '@/test/fixtures/categories';
import { customRender } from '@/test/utils';
import { mockServer } from '@/test/mocks/server';
import { CategoriesGetResponseType } from '@/types/categories';
import { CATEGORIES_BASE_URL } from '@/utils/constants';

const categoriesTableCaption = /a list of your categories/i;
const confirmDialogTitle = 'Are you sure?';
const confirmButtonText = 'Confirm';

function getCategoryRows() {
	const categoriesTable = screen.getByRole('table', {
		name: categoriesTableCaption,
	});

	const categoryRows = within(categoriesTable).getAllByRole('row').slice(1);

	return categoryRows;
}

describe('Categories', () => {
	it('renders page title', () => {
		customRender(<CategoriesPage />);
		const pageTitle = screen.getByRole('heading', { name: 'Categories', level: 1 });
		expect(pageTitle).toBeInTheDocument();
	});

	test('renders no-categories text when there are no categories', async () => {
		mockServer.use(
			http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
				CATEGORIES_BASE_URL,
				() => {
					return HttpResponse.json({ data: [] });
				},
			),
		);

		customRender(<CategoriesPage />);

		const noCategoriesText = await screen.findByText(
			'You do not have any categories. Create some categories to organize your transactions.',
		);

		expect(noCategoriesText).toBeVisible();
	});

	test('renders an error message when a network error occurs', async () => {
		mockServer.use(
			http.get(CATEGORIES_BASE_URL, () => {
				return HttpResponse.error();
			}),
		);

		customRender(<CategoriesPage />);

		const errorMessage = await screen.findByText(
			'Failed to fetch categories. Please try again later.',
		);

		expect(errorMessage).toBeVisible();
	});

	test('renders a categories table with column headers in the correct order', async () => {
		customRender(<CategoriesPage />);

		const categoriesTable = await screen.findByRole('table', {
			name: categoriesTableCaption,
		});

		const columnHeaders = within(categoriesTable).getAllByRole('columnheader');

		expect(columnHeaders[0]).toHaveAccessibleName(/select all/i);
		expect(columnHeaders[1]).toHaveTextContent('ID');
		expect(columnHeaders[2]).toHaveTextContent('Name');
	});

	test('renders a categories table with category details in the correct order', async () => {
		customRender(<CategoriesPage />);

		const categoriesTable = await screen.findByRole('table', {
			name: categoriesTableCaption,
		});

		const categoryRows = within(categoriesTable).getAllByRole('row').slice(1);

		categoryRows.forEach((row, i) => {
			const cells = within(row).getAllByRole('cell');
			expect(cells[0]).toHaveAccessibleName(/select row/i);
			expect(cells[1]).toHaveTextContent(categories[i].id.toString());
			expect(cells[2]).toHaveTextContent(categories[i].name);
		});
	});

	describe('Categories Table', () => {
		beforeEach(() => {
			customRender(<CategoriesPage />);
		});

		test('can select all rows', async () => {
			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const selectAllCheckbox = within(categoriesTable).getByRole('checkbox', {
				name: /select all/i,
			});

			await user.click(selectAllCheckbox);

			const selectedText = screen.getByText(
				`${categories.length} of ${categories.length} row(s) selected`,
			);

			expect(selectedText).toBeVisible();
		});
	});
});
