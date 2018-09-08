import fragment from './fragment';
import { quotePropIfNecessary } from '../utils/quoteIfNecessary';

export default function(node, target, options) {
	const name = node.attributes.find(attribute => attribute.name === 'name');

	const slotName = name && name.chunks[0].data || 'default';
	const prop = quotePropIfNecessary(slotName);

	target.append(`\${options && options.slotted && options.slotted${prop} ? options.slotted${prop}() : \``);

	fragment(node.children, target, options);

	target.append(`\`}`);
}