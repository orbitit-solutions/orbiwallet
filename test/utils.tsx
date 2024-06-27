import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';

function AllProviders({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function customRender(
	ui: React.ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) {
	return render(ui, { wrapper: AllProviders, ...options });
}
