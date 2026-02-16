type StorableObjects = 'tasks';

export const saveObjOnLocalStorage = <T>(key: StorableObjects, object: T) => {
	localStorage.setItem(key, JSON.stringify(object));
};

export const getObjFromLocalStorage = (key: StorableObjects) => {
	const item = localStorage.getItem(key);
	if (!item) return null;
	try {
		return JSON.parse(item);
	} catch {
		console.error('Error parsing localStorage item');
	}

	return null;
};

type StorableItems = 'tab';

export const saveItemLocalStorage = (key: StorableItems, item: string) => {
	localStorage.setItem(key, item);
};

export const getItemFromLocalStorage = (key: StorableItems) => {
	return localStorage.getItem(key);
};
