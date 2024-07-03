import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@/test/utils';
import EditAccountForm from '../components/edit-account-form';
import { accounts } from '@/test/fixtures/accounts';

const submitButtonText = 'Edit account';

beforeEach(() => {
	customRender(
		<EditAccountForm
			accountId={accounts[0].id}
			defaultValues={{ name: accounts[0].name }}
		/>,
	);
});

describe('Edit Account Form', () => {
	test('renders a form element with necessary fields and submit button', () => {
		const form = screen.getByRole('form', { name: /edit account/i });
		const nameInput = screen.getByLabelText('Name');
		const submitButton = screen.getByRole('button', { name: submitButtonText });

		[form, nameInput, submitButton].forEach(element => {
			expect(element).toBeVisible();
		});
	});

	test('form fields are pre-filled with account data', () => {
		const nameInput = screen.getByDisplayValue(accounts[0].name);
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
