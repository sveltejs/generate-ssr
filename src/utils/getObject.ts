type Node = any; // TODO

export default function getObject(node: Node) {
	while (node.type === 'MemberExpression') node = node.object;
	return node;
}
