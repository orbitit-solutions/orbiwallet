import React from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './alert-dialog';

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	description: string;
	onClickConfirm: () => void;
	onClickCancel: () => void;
}

function ConfirmDialog({
	open,
	title,
	description,
	onClickCancel,
	onClickConfirm,
}: ConfirmDialogProps) {
	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClickCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onClickConfirm}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default ConfirmDialog;
