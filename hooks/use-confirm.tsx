import { useState } from 'react';
/**
 * This hook provides an asynchronous confirm function for confirmation dialogs.
 * It is meant to be used in conjunction with `ConfirmDialog` component.
 * Apart from `confirm`, the rest of the values must be passed to ConfirmDialog as props
 */
export function useConfirm() {
	const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(
		null,
	);

	function confirm() {
		return new Promise<boolean>(resolve => {
			setPromise({ resolve });
		});
	}

	function handleClose() {
		setPromise(null);
	}

	function handleConfirm() {
		promise?.resolve(true);
		handleClose();
	}

	function handleCancel() {
		promise?.resolve(false);
		handleClose();
	}

	return {
		isOpen: promise !== null,
		confirm,
		handleConfirm,
		handleCancel,
	};
}
