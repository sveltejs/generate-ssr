import fragment from './fragment';

export default function(node, target, options) {
	target.append('${(__result.head += `');

	fragment(node.children, target, options);

	target.append('`, "")}');
}