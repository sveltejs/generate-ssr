import fragment from './fragment';

export default function(node, target, options) {
	const { snippet } = node.expression;

	target.append('${ ' + snippet + ' ? `');

	fragment(node.children, target, options);

	target.append('` : `');

	if (node.else) {
		fragment(node.else.children, target, options);
	}

	target.append('` }');
}