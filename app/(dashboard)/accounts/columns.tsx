'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import SortableColumnHeader from '@/components/ui/sortable-column-header';
import { AccountsGetResponseType } from '@/types/accounts';

export type Account = AccountsGetResponseType['data'][0];

export const columns: ColumnDef<Account>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'id',
		header: ({ column }) => <SortableColumnHeader column={column} title="ID" />,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <SortableColumnHeader column={column} title="Name" />,
	},
];
