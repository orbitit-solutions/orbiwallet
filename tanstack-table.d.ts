import '@tanstack/react-table';

declare module '@tanstack/table-core' {
	interface TableMeta<TData extends RowData> {
		onClickDelete: (id: number) => Promise<void>;
		onClickEdit?: (id: number) => void;
	}
}
