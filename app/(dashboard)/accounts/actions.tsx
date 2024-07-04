'use client';

import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsProps {
	onClickEdit?: () => void;
	onClickDelete: () => void;
}

function Actions({ onClickEdit, onClickDelete }: ActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="size-8 p-0">
					<span className="sr-only">Open actions</span>
					<MoreHorizontal className="size-4" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				{onClickEdit && (
					<DropdownMenuItem onClick={onClickEdit}>
						<Edit className="size-4 mr-2" aria-hidden="true" />
						Edit
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={onClickDelete}>
					<Trash2 className="size-4 mr-2" aria-hidden="true" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default Actions;
