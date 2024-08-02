import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultBodyType, HttpResponse, PathParams, http } from 'msw';

import CategoriesPage from '@/app/(dashboard)/categories/page';
import { categories } from '@/test/fixtures/categories';
import { customRender } from '@/test/utils';
import { mockServer } from '@/test/mocks/server';
import { CategoriesGetResponseType } from '@/types/categories';
import { CATEGORIES_BASE_URL } from '@/utils/constants';
import { Toaster } from '@/components/ui/sonner';

const categoriesTableCaption = /a list of your categories/i;
const confirmDialogTitle = 'Are you sure?';
const confirmButtonText = 'Confirm';
const actionsButtonName = /open actions/i;
const editCategoryDialogTitle = 'Edit Category';

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

	test('shows create category form when new category button is clicked', async () => {
		customRender(<CategoriesPage />);
		const user = userEvent.setup();
		const newCategoryButton = screen.getByRole('button', { name: /new category/i });

		await user.click(newCategoryButton);

		const createCategoryFormTitle = screen.getByRole('heading', {
			name: 'Create Category',
			level: 2,
		});

		const createCategoryForm = screen.getByRole('form', { name: /create category/i });

		expect(createCategoryForm).toBeVisible();
		expect(createCategoryFormTitle).toBeVisible();
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
		expect(columnHeaders[3]).toHaveAccessibleName(/actions/i);
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
			expect(
				within(cells[3]).getByRole('button', { name: actionsButtonName }),
			).toBeInTheDocument();
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

	describe('Category Creation', () => {
		test('creates a category and shows a success message', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			const newCategory = { id: categories.length + 1, name: 'My Test Category' };

			mockServer.use(
				http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
					CATEGORIES_BASE_URL,
					() => {
						return HttpResponse.json({
							data: [...categories, newCategory],
						});
					},
				),
			);

			const user = userEvent.setup();
			const newCategoryButton = screen.getByRole('button', { name: /new category/i });

			await user.click(newCategoryButton);

			const createCategoryForm = screen.getByRole('form', { name: /create category/i });
			const nameInput = within(createCategoryForm).getByLabelText('Name');
			const createCategoryButton = within(createCategoryForm).getByRole('button', {
				name: 'Create category',
			});

			await user.type(nameInput, newCategory.name);
			await user.click(createCategoryButton);

			const successMessage = await screen.findByText('Category created successfully!');
			const newCategoryNameCell = await screen.findByRole('cell', {
				name: newCategory.name,
			});

			expect(successMessage).toBeVisible();
			expect(newCategoryNameCell).toBeVisible();
		});

		test('shows an error message when a category cannot be created', async () => {
			mockServer.use(
				http.post(CATEGORIES_BASE_URL, () => {
					return HttpResponse.error();
				}),
			);

			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			const user = userEvent.setup();
			const newCategoryButton = screen.getByRole('button', { name: /new category/i });

			await user.click(newCategoryButton);

			const createCategoryForm = screen.getByRole('form', { name: /create category/i });
			const nameInput = within(createCategoryForm).getByLabelText('Name');
			const createCategoryButton = within(createCategoryForm).getByRole('button', {
				name: 'Create category',
			});

			await user.type(nameInput, 'My Test Category');
			await user.click(createCategoryButton);

			const errorMessage = await screen.findByText('Failed to create a category.');

			expect(errorMessage).toBeVisible();
		});
	});

	describe('Category Update', () => {
		test('updates a category and shows a success message', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			// Updating the first category
			const updatedCategoryName = `${categories[0].name} updated`;

			mockServer.use(
				http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
					CATEGORIES_BASE_URL,
					() => {
						const updatedCategories = categories.map(category => {
							if (category.id === categories[0].id) {
								return { ...category, name: updatedCategoryName };
							}

							return category;
						});

						return HttpResponse.json({ data: updatedCategories });
					},
				),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const firstRowActionsButton = within(categoriesTable).getAllByRole('button', {
				name: actionsButtonName,
			})[0];

			await user.click(firstRowActionsButton);

			const actionsMenu = screen.getByRole('menu', { name: actionsButtonName });
			const editMenuItem = within(actionsMenu).getByRole('menuitem', { name: 'Edit' });

			await user.click(editMenuItem);

			const editCategoryDialog = screen.getByRole('dialog', {
				name: editCategoryDialogTitle,
			});
			const editCategoryForm = within(editCategoryDialog).getByRole('form', {
				name: editCategoryDialogTitle,
			});
			const nameInput = within(editCategoryForm).getByLabelText('Name');
			const editCategoryButton = within(editCategoryForm).getByRole('button', {
				name: 'Edit category',
			});

			await user.clear(nameInput);
			await user.type(nameInput, updatedCategoryName);
			await user.click(editCategoryButton);

			const successMessage = await screen.findByText('Category updated successfully!');
			const updatedCategoryNameCell = await screen.findByRole('cell', {
				name: updatedCategoryName,
			});
			const categoryNameCellBeforeUpdate = screen.queryByRole('cell', {
				name: categories[0].name,
			});

			expect(successMessage).toBeVisible();
			expect(updatedCategoryNameCell).toBeVisible();
			expect(categoryNameCellBeforeUpdate).not.toBeInTheDocument();
		});

		test('shows an error message when category information cannot be fetched', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			mockServer.use(
				http.get(`${CATEGORIES_BASE_URL}/:id`, () => {
					return HttpResponse.error();
				}),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const firstRowActionsButton = within(categoriesTable).getAllByRole('button', {
				name: actionsButtonName,
			})[0];

			await user.click(firstRowActionsButton);

			const actionsMenu = screen.getByRole('menu', { name: actionsButtonName });
			const editMenuItem = within(actionsMenu).getByRole('menuitem', { name: 'Edit' });

			await user.click(editMenuItem);

			const editCategoryDialog = screen.getByRole('dialog', {
				name: editCategoryDialogTitle,
			});
			const editCategoryForm = within(editCategoryDialog).queryByRole('form', {
				name: editCategoryDialogTitle,
			});
			const errorMessage = within(editCategoryDialog).getByText(
				'Failed to fetch category. Please try again later.',
			);

			expect(errorMessage).toBeVisible();
			expect(editCategoryForm).not.toBeInTheDocument();
		});

		test('shows an error message when an account cannot be updated', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			mockServer.use(
				http.patch(`${CATEGORIES_BASE_URL}/:id`, () => {
					return HttpResponse.error();
				}),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const firstRowActionsButton = within(categoriesTable).getAllByRole('button', {
				name: actionsButtonName,
			})[0];

			await user.click(firstRowActionsButton);

			const actionsMenu = screen.getByRole('menu', { name: actionsButtonName });
			const editMenuItem = within(actionsMenu).getByRole('menuitem', { name: 'Edit' });

			await user.click(editMenuItem);

			const editCategoryDialog = screen.getByRole('dialog', {
				name: editCategoryDialogTitle,
			});
			const editCategoryForm = within(editCategoryDialog).getByRole('form', {
				name: editCategoryDialogTitle,
			});
			const editCategoryButton = within(editCategoryForm).getByRole('button', {
				name: 'Edit category',
			});

			await user.click(editCategoryButton);

			const errorMessage = await screen.findByText('Failed to update category.');

			expect(errorMessage).toBeVisible();
		});
	});

	describe('Category Bulk Deletion', () => {
		test('deletes a category and shows a success message', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			const deletedCategoryId = categories[0].id;

			mockServer.use(
				http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
					CATEGORIES_BASE_URL,
					() => {
						return HttpResponse.json({
							data: categories.filter(category => category.id !== deletedCategoryId),
						});
					},
				),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const selectCheckboxes = within(categoriesTable).getAllByRole('checkbox');

			// Select checkbox for the first category
			await user.click(selectCheckboxes[1]);

			const deleteButton = screen.getByRole('button', {
				name: `Delete 1 row`,
			});

			await user.click(deleteButton);

			const confirmDialog = screen.getByRole('alertdialog', {
				name: confirmDialogTitle,
			});

			const confirmButton = within(confirmDialog).getByRole('button', {
				name: confirmButtonText,
			});

			await user.click(confirmButton);

			const successMessage = await screen.findByText('Category deleted successfully!');

			const deletedCategoryNameCell = screen.queryByRole('cell', {
				name: categories[0].name,
			});

			expect(successMessage).toBeVisible();
			expect(deletedCategoryNameCell).not.toBeInTheDocument();
		});

		test('deletes multiple selected categories and shows a success message', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			const deletedCategoryIds = [categories[0].id, categories[1].id];

			mockServer.use(
				http.get<PathParams, DefaultBodyType, CategoriesGetResponseType>(
					CATEGORIES_BASE_URL,
					() => {
						return HttpResponse.json({
							data: categories.filter(
								category => !deletedCategoryIds.includes(category.id),
							),
						});
					},
				),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const selectCheckboxes = within(categoriesTable).getAllByRole('checkbox');

			// Select checkbox for the first two categories
			await user.click(selectCheckboxes[1]);
			await user.click(selectCheckboxes[2]);

			const deleteButton = screen.getByRole('button', {
				name: `Delete 2 rows`,
			});

			await user.click(deleteButton);

			const confirmDialog = screen.getByRole('alertdialog', {
				name: confirmDialogTitle,
			});

			const confirmButton = within(confirmDialog).getByRole('button', {
				name: confirmButtonText,
			});

			await user.click(confirmButton);

			const successMessage = await screen.findByText('Categories deleted successfully!');

			const deletedCategory1NameCell = screen.queryByRole('cell', {
				name: categories[0].name,
			});

			const deletedCategory2NameCell = screen.queryByRole('cell', {
				name: categories[1].name,
			});

			expect(successMessage).toBeVisible();
			expect(deletedCategory1NameCell).not.toBeInTheDocument();
			expect(deletedCategory2NameCell).not.toBeInTheDocument();
		});

		test('shows an error message when a category cannot be deleted', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			mockServer.use(
				http.post(`${CATEGORIES_BASE_URL}/bulk-delete`, () => {
					return HttpResponse.error();
				}),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const selectCheckboxes = within(categoriesTable).getAllByRole('checkbox');

			await user.click(selectCheckboxes[1]);

			const deleteButton = screen.getByRole('button', {
				name: `Delete 1 row`,
			});

			await user.click(deleteButton);

			const confirmDialog = screen.getByRole('alertdialog', {
				name: confirmDialogTitle,
			});

			const confirmButton = within(confirmDialog).getByRole('button', {
				name: confirmButtonText,
			});

			await user.click(confirmButton);

			const errorMessage = await screen.findByText('Failed to delete category.');

			expect(errorMessage).toBeVisible();
		});

		test('shows an error message when multiple selected categories cannot be deleted', async () => {
			customRender(
				<>
					<Toaster />
					<CategoriesPage />
				</>,
			);

			mockServer.use(
				http.post(`${CATEGORIES_BASE_URL}/bulk-delete`, () => {
					return HttpResponse.error();
				}),
			);

			const user = userEvent.setup();

			const categoriesTable = await screen.findByRole('table', {
				name: categoriesTableCaption,
			});

			const selectCheckboxes = within(categoriesTable).getAllByRole('checkbox');

			await user.click(selectCheckboxes[1]);
			await user.click(selectCheckboxes[2]);

			const deleteButton = screen.getByRole('button', {
				name: `Delete 2 rows`,
			});

			await user.click(deleteButton);

			const confirmDialog = screen.getByRole('alertdialog', {
				name: confirmDialogTitle,
			});

			const confirmButton = within(confirmDialog).getByRole('button', {
				name: confirmButtonText,
			});

			await user.click(confirmButton);

			const errorMessage = await screen.findByText('Failed to delete categories.');

			expect(errorMessage).toBeVisible();
		});
	});
});
