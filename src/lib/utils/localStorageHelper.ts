type Storable = 'tasks';

export const saveObjOnLocalStorage = <T>(key: Storable, object: T) => {
	localStorage.setItem(key, JSON.stringify(object));
};

export const getObjFromLocalStorage = (key: Storable) => {
	const item = localStorage.getItem(key);
	if (!item) return null;
	try {
		return JSON.parse(item);
	} catch {
		console.error('Error parsing localStorage item');
	}

	return null;
};
