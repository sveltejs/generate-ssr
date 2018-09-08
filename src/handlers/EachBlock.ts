import fragment from './fragment';

export default function(node, target, options) {
	const { snippet } = node.expression;

	const props = node.contexts.map(prop => `${prop.key.name}: item${prop.tail}`);

	const getContext = node.index
		? `(item, i) => Object.assign({}, ctx, { ${props.join(', ')}, ${node.index}: i })`
		: `item => Object.assign({}, ctx, { ${props.join(', ')} })`;

	const open = `\${ ${node.else ? `${snippet}.length ? ` : ''}@each(${snippet}, ${getContext}, ctx => \``;
	target.append(open);

	fragment(node.children, target, options);

	const close = `\`)`;
	target.append(close);

	if (node.else) {
		target.append(` : \``);
		fragment(node.else.children, target, options);
		target.append(`\``);
	}

	target.append('}');
}