import CreateAccountForm from '@/features/accounts/components/create-account-form';
import CreateAccountSheet from '@/features/accounts/components/create-account-sheet';
import React from 'react';

function AccountsPage() {
	return (
		<div>
			<h1>Accounts</h1>
			<CreateAccountSheet />
		</div>
	);
}

export default AccountsPage;
