import { escape, escapeHTML, escapeTemplate } from '../utils/stringify';

export default function(node, target) {
	let text = node.data;
	if (
		!node.parent ||
		node.parent.type !== 'Element' ||
		(node.parent.name !== 'script' && node.parent.name !== 'style')
	) {
		// unless this Text node is inside a <script> or <style> element, escape &,<,>
		text = escapeHTML(text);
	}
	target.append(escape(escapeTemplate(text)));
}