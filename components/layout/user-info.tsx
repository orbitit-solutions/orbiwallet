'use client';

import { UserButton, useUser } from '@clerk/nextjs';

function UserInfo() {
	const { user } = useUser();
	return (
		<div className="flex items-center gap-x-3">
			<UserButton
				afterSignOutUrl="/sign-in"
				appearance={{ elements: { avatarBox: 'size-10' } }}
			/>
			{user && (
				<p className="hidden sm:block font-medium text-sm">
					{user.firstName ? `Hello, ${user.firstName}` : 'Welcome back'}
				</p>
			)}
		</div>
	);
}

export default UserInfo;
