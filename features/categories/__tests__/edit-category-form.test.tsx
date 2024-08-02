import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@/test/utils';
import EditCategoryForm from '../components/edit-category-form';
import { categories } from '@/test/fixtures/categories';

const submitButtonText = 'Edit category';

beforeEach(() => {
	customRender(
		<EditCategoryForm
			categoryId={categories[0].id}
			defaultValues={{ name: categories[0].name }}
		/>,
	);
});

describe('Edit Category Form', () => {
	test('renders a form element with necessary fields and submit button', () => {
		const form = screen.getByRole('form', { name: /edit category/i });
		const nameInput = screen.getByLabelText('Name');
		const submitButton = screen.getByRole('button', { name: submitButtonText });

		[form, nameInput, submitButton].forEach(element => {
			expect(element).toBeVisible();
		});
	});

	test('form fields are pre-filled with category data', () => {
		const nameInput = screen.getByDisplayValue(categories[0].name);
		expect(nameInput).toBeVisible();
	});

	test('shows an error message if name is not provided', async () => {
		const user = userEvent.setup();
		const nameInput = screen.getByLabelText('Name');

		await user.clear(nameInput);
		await user.click(screen.getByRole('button', { name: submitButtonText }));

		const nameError = screen.getByText('Name is required');

		expect(nameError).toBeVisible();
	});
});
