import fragment from './fragment';

export default function(node, target) {
	target.append(`<title>`);

	fragment(node.children, target);

	target.append(`</title>`);
}