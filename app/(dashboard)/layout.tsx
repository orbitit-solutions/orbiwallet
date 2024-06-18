import Header from '@/components/layout/header';

function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<Header />
			<main className="px-3 py-4 lg:px-10">{children}</main>
		</>
	);
}

export default DashboardLayout;
