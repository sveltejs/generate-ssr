import fragment from './fragment';

export default function(node, target, options) {
	target.append(`<title>`);

	fragment(node.children, target, options);

	target.append(`</title>`);
}