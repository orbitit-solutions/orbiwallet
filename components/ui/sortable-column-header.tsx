import { Column } from '@tanstack/react-table';
import React from 'react';
import { Button } from './button';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';

interface SortableColumnHeaderProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
}

function SortableColumnHeader<TData, TValue>({
	column,
	title,
}: SortableColumnHeaderProps<TData, TValue>) {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
		>
			{title}
			{column.getIsSorted() === 'desc' ? (
				<SortDesc className="ml-2 h-4 w-4" />
			) : column.getIsSorted() === 'asc' ? (
				<SortAsc className="ml-2 h-4 w-4" />
			) : (
				<ArrowUpDown className="ml-2 h-4 w-4" />
			)}
		</Button>
	);
}

export default SortableColumnHeader;
