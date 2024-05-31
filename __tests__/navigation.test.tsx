import Navigation from '@/components/layout/navigation';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Navigation', () => {
	it('renders Overview link that goes to Home page', () => {
		render(<Navigation />);
		const overviewLink = screen.getByRole('link', { name: /overview/i });
		expect(overviewLink).toBeInTheDocument();
		expect(overviewLink).toHaveAttribute('href', '/');
	});

	it('renders Transactions link that goes to Transactions page', () => {
		render(<Navigation />);
		const transactionsLink = screen.getByRole('link', { name: /transactions/i });
		expect(transactionsLink).toBeInTheDocument();
		expect(transactionsLink).toHaveAttribute('href', '/transactions');
	});

	it('renders Accounts link that goes to Accounts page', () => {
		render(<Navigation />);
		const accountsLink = screen.getByRole('link', { name: /accounts/i });
		expect(accountsLink).toBeInTheDocument();
		expect(accountsLink).toHaveAttribute('href', '/accounts');
	});

	it('renders Categories link that goes to Categories page', () => {
		render(<Navigation />);
		const categoriesLink = screen.getByRole('link', { name: /categories/i });
		expect(categoriesLink).toBeInTheDocument();
		expect(categoriesLink).toHaveAttribute('href', '/categories');
	});

	it('renders Settings link that goes to Settings page', () => {
		render(<Navigation />);
		const settingsLink = screen.getByRole('link', { name: /settings/i });
		expect(settingsLink).toBeInTheDocument();
		expect(settingsLink).toHaveAttribute('href', '/settings');
	});
});
