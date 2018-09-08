export default function(node, target, options) {
	if (options.preserveComments) {
		target.append(`<!--${node.data}-->`);
	}
}