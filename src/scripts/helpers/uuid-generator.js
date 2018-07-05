function uuidFromString(str) {
	const uuidv5 = require('uuid/v5');
	return uuidv5(str, uuidv5.DNS);
}

export {
  uuidFromString
}