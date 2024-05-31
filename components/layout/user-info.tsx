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
				<div className="hidden sm:block">
					<p className="font-medium text-lg">
						{user.firstName ? `Hello, ${user.firstName}` : 'Welcome back'}
					</p>
					{user.primaryEmailAddress && (
						<p className="font text-xs text-slate-600">
							{user.primaryEmailAddress.emailAddress}
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export default UserInfo;
