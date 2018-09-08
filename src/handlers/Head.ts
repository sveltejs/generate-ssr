import fragment from './fragment';

export default function(node, target) {
	target.append('${(__result.head += `');

	fragment(node.children, target);

	target.append('`, "")}');
}