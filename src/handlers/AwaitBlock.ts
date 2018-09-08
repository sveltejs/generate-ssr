import fragment from './Fragment';

export default function(node, target) {
	const { snippet } = node.expression;

	target.append('${(function(__value) { if(@isPromise(__value)) return `');

	fragment(node.pending.children, target);

	target.append('`; return function(ctx) { return `');

	fragment(node.then.children, target);

	target.append(`\`;}(Object.assign({}, ctx, { ${node.value}: __value }));}(${snippet})) }`);
}