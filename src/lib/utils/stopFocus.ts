export const stopFocus = (
	e: FocusEvent & {
		currentTarget: EventTarget & HTMLButtonElement;
	}
) => {
	e.currentTarget.blur();
};
