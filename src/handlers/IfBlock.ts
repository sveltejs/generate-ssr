import fragment from './fragment';

export default function(node, target) {
	const { snippet } = node.expression;

	target.append('${ ' + snippet + ' ? `');

	fragment(node.children, target);

	target.append('` : `');

	if (node.else) {
		fragment(node.else.children, target);
	}

	target.append('` }');
}