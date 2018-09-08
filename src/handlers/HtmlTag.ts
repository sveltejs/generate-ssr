export default function(node, target) {
	target.append('${' + node.expression.snippet + '}');
}