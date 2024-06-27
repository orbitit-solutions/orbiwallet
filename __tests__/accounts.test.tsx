import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultBodyType, HttpResponse, PathParams, http } from 'msw';
import { InferResponseType } from 'hono';

import AccountsPage from '@/app/(dashboard)/accounts/page';
import { customRender } from '@/test/utils';
import { accounts } from '@/test/fixtures/accounts';
import { mockServer } from '@/test/mocks/server';
import { client } from '@/lib/hono';

describe('Accounts', () => {
	test('renders page title', () => {
		customRender(<AccountsPage />);
		const pageTitle = screen.getByRole('heading', { name: 'Accounts', level: 1 });
		expect(pageTitle).toBeInTheDocument();
	});

	test('shows create account form when new account button is clicked', async () => {
		customRender(<AccountsPage />);
		const user = userEvent.setup();
		const newAccountButton = screen.getByRole('button', { name: /new account/i });

		await user.click(newAccountButton);

		const createAccountFormTitle = screen.getByRole('heading', {
			name: 'Create Account',
			level: 2,
		});

		const createAccountForm = screen.getByRole('form', { name: /create account/i });

		expect(createAccountForm).toBeVisible();
		expect(createAccountFormTitle).toBeVisible();
	});

	test('renders an accounts table with column headers in the correct order', async () => {
		customRender(<AccountsPage />);
		const columnHeaders = await screen.findAllByRole('columnheader');

		expect(columnHeaders[0]).toHaveAccessibleName(/select all/i);
		expect(columnHeaders[1]).toHaveTextContent('ID');
		expect(columnHeaders[2]).toHaveTextContent('Name');
	});

	test('renders no-accounts text when there are no accounts', async () => {
		mockServer.use(
			http.get<
				PathParams,
				DefaultBodyType,
				InferResponseType<typeof client.api.accounts.$get>
			>(`${process.env.NEXT_PUBLIC_APP_URL}/api/accounts`, () => {
				return HttpResponse.json({ data: [] });
			}),
		);

		customRender(<AccountsPage />);

		const noAccountsText = await screen.findByText(
			'You do not have any accounts. Create an account to start tracking your transactions.',
		);

		expect(noAccountsText).toBeVisible();
	});

	test('renders an error message when a network error occurs', async () => {
		mockServer.use(
			http.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/accounts`, () => {
				return HttpResponse.error();
			}),
		);

		customRender(<AccountsPage />);

		const errorMessage = await screen.findByText(
			'Failed to fetch accounts. Please try again later.',
		);

		expect(errorMessage).toBeVisible();
	});

	test('renders an accounts table with account details in the correct order', async () => {
		customRender(<AccountsPage />);
		const accountRows = (await screen.findAllByRole('row')).slice(1);

		accountRows.forEach((row, i) => {
			const cells = within(row).getAllByRole('cell');
			expect(cells[0]).toHaveAccessibleName(/select row/i);
			expect(cells[1]).toHaveTextContent(accounts[i].id.toString());
			expect(cells[2]).toHaveTextContent(accounts[i].name);
		});
	});

	describe('Accounts Table', () => {
		beforeEach(() => {
			customRender(<AccountsPage />);
		});

		test('can filter accounts by name', async () => {
			const user = userEvent.setup();
			const filterInput = await screen.findByPlaceholderText(/filter by name/i);

			await user.type(filterInput, accounts[0].name);

			expect(screen.getByRole('cell', { name: accounts[0].name })).toBeVisible();

			expect(
				screen.queryByRole('cell', { name: accounts[1].name }),
			).not.toBeInTheDocument();
		});

		test('can sort accounts by name in ascending order', async () => {
			const user = userEvent.setup();
			const nameSortButton = await screen.findByRole('button', { name: 'Name' });

			await user.click(nameSortButton);

			const accountRows = screen.getAllByRole('row').slice(1);
			const firstRowCells = within(accountRows[0]).getAllByRole('cell');
			const secondRowCells = within(accountRows[1]).getAllByRole('cell');

			expect(firstRowCells[2]).toHaveTextContent(accounts[0].name);
			expect(secondRowCells[2]).toHaveTextContent(accounts[1].name);
		});

		test('can sort accounts by name in descending order', async () => {
			const user = userEvent.setup();
			const nameSortButton = await screen.findByRole('button', { name: 'Name' });

			await user.click(nameSortButton);
			await user.click(nameSortButton);

			const accountRows = screen.getAllByRole('row').slice(1);
			const firstRowCells = within(accountRows[0]).getAllByRole('cell');
			const secondRowCells = within(accountRows[1]).getAllByRole('cell');

			expect(firstRowCells[2]).toHaveTextContent(accounts[1].name);
			expect(secondRowCells[2]).toHaveTextContent(accounts[0].name);
		});

		test('can sort accounts by ID in ascending order', async () => {
			const user = userEvent.setup();
			const idSortButton = await screen.findByRole('button', { name: 'ID' });

			await user.click(idSortButton);

			const accountRows = screen.getAllByRole('row').slice(1);
			const firstRowCells = within(accountRows[0]).getAllByRole('cell');
			const secondRowCells = within(accountRows[1]).getAllByRole('cell');

			expect(firstRowCells[1]).toHaveTextContent(accounts[0].id.toString());
			expect(secondRowCells[1]).toHaveTextContent(accounts[1].id.toString());
		});

		test('can sort accounts by ID in ascending order', async () => {
			const user = userEvent.setup();
			const idSortButton = await screen.findByRole('button', { name: 'ID' });

			await user.click(idSortButton);
			await user.click(idSortButton);

			const accountRows = screen.getAllByRole('row').slice(1);
			const firstRowCells = within(accountRows[0]).getAllByRole('cell');
			const secondRowCells = within(accountRows[1]).getAllByRole('cell');

			expect(firstRowCells[1]).toHaveTextContent(accounts[1].id.toString());
			expect(secondRowCells[1]).toHaveTextContent(accounts[0].id.toString());
		});

		test('can select all rows', async () => {
			const user = userEvent.setup();
			const selectAllCheckbox = await screen.findByRole('checkbox', {
				name: /select all/i,
			});

			await user.click(selectAllCheckbox);

			const selectedText = screen.getByText(
				`${accounts.length} of ${accounts.length} row(s) selected`,
			);

			expect(selectedText).toBeVisible();
		});

		test('has pagination buttons', async () => {
			const previousButton = await screen.findByRole('button', { name: 'Previous' });
			const nextButton = await screen.findByRole('button', { name: 'Next' });

			expect(previousButton).toBeVisible();
			expect(nextButton).toBeVisible();
		});

		test('shows delete button when accounts are selected and clicking it opens a confirmation dialog', async () => {
			const user = userEvent.setup();
			const selectAllCheckbox = await screen.findByRole('checkbox', {
				name: /select all/i,
			});

			await user.click(selectAllCheckbox);

			const deleteButton = screen.getByRole('button', {
				name: `Delete ${accounts.length} rows`,
			});

			await user.click(deleteButton);

			const confirmDialog = screen.getByRole('alertdialog', {
				name: 'Are you sure?',
			});

			const confirmButton = within(confirmDialog).getByRole('button', {
				name: 'Confirm',
			});
			const cancelButton = within(confirmDialog).getByRole('button', { name: 'Cancel' });

			[confirmDialog, confirmButton, cancelButton].forEach(element => {
				expect(element).toBeVisible();
			});
		});

		test('clicking cancel button closes the confirmation dialog', async () => {
			const user = userEvent.setup();
			const selectCheckboxes = await screen.findAllByRole('checkbox');

			await user.click(selectCheckboxes[1]);

			const deleteButton = screen.getByRole('button', {
				name: `Delete 1 row`,
			});

			await user.click(deleteButton);

			const cancelButton = screen.getByRole('button', { name: 'Cancel' });

			await user.click(cancelButton);

			const confirmDialog = screen.queryByRole('alertdialog', { name: 'Are you sure?' });

			expect(confirmDialog).not.toBeInTheDocument();
		});
	});
});
