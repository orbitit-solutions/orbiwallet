import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
	classes?: string;
}

function LoadingSpinner({ classes }: LoadingSpinnerProps) {
	return <Loader2 className={cn('size-8 animate-spin text-brand-dark', classes || '')} />;
}

export default LoadingSpinner;
