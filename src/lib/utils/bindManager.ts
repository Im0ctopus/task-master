export const bindManager = (e: KeyboardEvent, toggleIsTyping: (val: boolean) => void) => {
	const key = e.key;
	// FIXME: remove this pls
	console.log(key);

	switch (key) {
		case 'Enter':
			if (e.ctrlKey) {
				toggleIsTyping(true);
			} else {
				// TODO: open task
			}
			break;
	}
};
