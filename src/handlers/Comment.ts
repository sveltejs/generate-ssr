export default function(node, target, options = {}) { // TODO pass through options
	// Allow option to preserve comments, otherwise ignore
	if (options.preserveComments) {
		target.append(`<!--${node.data}-->`);
	}
}