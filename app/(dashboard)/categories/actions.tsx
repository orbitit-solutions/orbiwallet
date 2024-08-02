'use client';

import { Edit, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsProps {
	onClickEdit: () => void;
}

function Actions({ onClickEdit }: ActionsProps) {
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
				<DropdownMenuItem onClick={onClickEdit}>
					<Edit className="size-4 mr-2" aria-hidden="true" />
					Edit
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default Actions;
