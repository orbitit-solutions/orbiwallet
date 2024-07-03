import '@tanstack/react-table';

declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> {
		onClickEdit?: (id: number) => void;
	}
}
