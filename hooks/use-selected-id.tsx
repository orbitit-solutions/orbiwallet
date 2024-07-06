import { useState } from 'react';

/**
 * This hook keeps track of the currently selected ID. It can be used to control the state of a component that shows some data based on the selected ID, for example, the open and close state of a modal component that contains a form to edit a post.
 */

export function useSelectedId() {
	const [selectedId, setSelectedId] = useState<undefined | number>(undefined);

	const isSelectedId = selectedId !== undefined;

	function setId(id: number) {
		setSelectedId(id);
	}

	function unsetId() {
		setSelectedId(undefined);
	}

	return { isSelectedId, selectedId, setId, unsetId };
}
