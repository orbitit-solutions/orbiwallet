'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import {
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from './button';
import { Input } from './input';

import { useConfirm } from '@/hooks/use-confirm';
import ConfirmDialog from './confirm-dialog';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterKey: string;
	onBulkDelete: (rows: Row<TData>[]) => void;
	onDelete: (id: number) => void;
	disabled?: boolean;
	tableCaption: string;
	onClickEdit?: (id: number) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterKey,
	onBulkDelete,
	onDelete,
	disabled,
	tableCaption,
	onClickEdit,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,
		meta: {
			onClickDelete: handleClickDelete,
			...(onClickEdit && { onClickEdit }),
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		state: { sorting, columnFilters, rowSelection },
	});

	const {
		isOpen: isBulkDeleteConfirmDialogOpen,
		confirm: confirmBulkDelete,
		handleConfirm: handleConfirmBulkDelete,
		handleCancel: handleCancelBulkDelete,
	} = useConfirm();

	const {
		isOpen: isDeleteConfirmDialogOpen,
		confirm: confirmDelete,
		handleConfirm: handleConfirmDelete,
		handleCancel: handleCancelDelete,
	} = useConfirm();

	const selectedRows = table.getFilteredSelectedRowModel().rows;

	async function handleClickBulkDelete() {
		const isConfirmed = await confirmBulkDelete();

		if (isConfirmed) {
			onBulkDelete(selectedRows);
			table.resetRowSelection();
		}
	}

	async function handleClickDelete(id: number) {
		const isConfirmed = await confirmDelete();
		if (isConfirmed) onDelete(id);
	}

	return (
		<div>
			<ConfirmDialog
				title="Are you sure?"
				description="This action cannot be undone. This will permanently delete the row and associated data."
				open={isDeleteConfirmDialogOpen}
				onClickConfirm={handleConfirmDelete}
				onClickCancel={handleCancelDelete}
			/>
			<ConfirmDialog
				title="Are you sure?"
				description="This action cannot be undone. This will permanently delete the selected rows and associated data."
				open={isBulkDeleteConfirmDialogOpen}
				onClickConfirm={handleConfirmBulkDelete}
				onClickCancel={handleCancelBulkDelete}
			/>
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder={`Filter by ${filterKey}...`}
					value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
					onChange={e => table.getColumn(filterKey)?.setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
				{selectedRows.length > 0 && (
					<Button
						size="sm"
						variant="outline"
						className="text-xs"
						disabled={disabled}
						onClick={handleClickBulkDelete}
					>
						<Trash className="size-4 mr-2" /> Delete {selectedRows.length} row
						{selectedRows.length > 1 ? 's' : ''}
					</Button>
				)}
			</div>
			<div className="rounded-md border">
				<Table>
					<TableCaption className="sr-only">{tableCaption}</TableCaption>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
