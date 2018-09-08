import isValidIdentifier from './isValidIdentifier';

export function quoteNameIfNecessary(name: string) {
	if (!isValidIdentifier(name)) return `"${name}"`;
	return name;
}

export function quotePropIfNecessary(name: string) {
	if (!isValidIdentifier(name)) return `["${name}"]`;
	return `.${name}`;
}