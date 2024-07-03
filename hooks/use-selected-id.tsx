import { useState } from 'react';

/**
 * This hook keeps track of the currently selected ID. It can be used to control the open and close state of a component that shows some data related to the ID, for example, a modal component that contains a form to edit something.
 */

export function useSelectedId() {
	const [selectedId, setSelectedId] = useState<undefined | number>(undefined);

	const isOpen = selectedId !== undefined;

	function handleOpen(id: number) {
		setSelectedId(id);
	}

	function handleClose() {
		setSelectedId(undefined);
	}

	return { isOpen, selectedId, handleOpen, handleClose };
}
