import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@/test/utils';
import CreateAccountForm from '../components/create-account-form';

const submitButtonText = 'Create account';

beforeEach(() => {
	customRender(<CreateAccountForm />);
});

describe('Create Account Form', () => {
	test('renders a form element with necessary fields and submit button', () => {
		const form = screen.getByRole('form', { name: /create account/i });
		const nameInput = screen.getByLabelText('Name');
		const submitButton = screen.getByRole('button', { name: submitButtonText });

		[form, nameInput, submitButton].forEach(element => {
			expect(element).toBeVisible();
		});
	});

	test('shows an error message if name is not provided', async () => {
		const user = userEvent.setup();

		await user.click(screen.getByRole('button', { name: submitButtonText }));

		const nameError = screen.getByText('Name is required');

		expect(nameError).toBeVisible();
	});
});
