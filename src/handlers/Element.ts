import fragment from './fragment';
import isVoidElementName from '../utils/isVoidElementName';
import { quoteNameIfNecessary, quotePropIfNecessary } from '../utils/quoteIfNecessary';

// source: https://gist.github.com/ArjanSchouten/0b8574a6ad7f5065a5e7
const booleanAttributes = new Set([
	'async',
	'autocomplete',
	'autofocus',
	'autoplay',
	'border',
	'challenge',
	'checked',
	'compact',
	'contenteditable',
	'controls',
	'default',
	'defer',
	'disabled',
	'formnovalidate',
	'frameborder',
	'hidden',
	'indeterminate',
	'ismap',
	'loop',
	'multiple',
	'muted',
	'nohref',
	'noresize',
	'noshade',
	'novalidate',
	'nowrap',
	'open',
	'readonly',
	'required',
	'reversed',
	'scoped',
	'scrolling',
	'seamless',
	'selected',
	'sortable',
	'spellcheck',
	'translate'
]);

export default function(node, target) {
	let openingTag = `<${node.name}`;
	let textareaContents; // awkward special case

	const slot = node.getStaticAttributeValue('slot');
	if (slot && node.hasAncestor('Component')) {
		const slot = node.attributes.find((attribute: Node) => attribute.name === 'slot');
		const slotName = slot.chunks[0].data;
		const appendTarget = target.appendTargets[target.appendTargets.length - 1];
		appendTarget.slotStack.push(slotName);
		appendTarget.slots[slotName] = '';
	}

	const classExpr = node.classes.map((classDir: Class) => {
		const { expression, name } = classDir;
		const snippet = expression ? expression.snippet : `ctx${quotePropIfNecessary(name)}`;
		return `${snippet} ? "${name}" : ""`;
	}).join(', ');

	let addClassAttribute = classExpr ? true : false;

	if (node.attributes.find(attr => attr.isSpread)) {
		// TODO dry this out
		const args = [];
		node.attributes.forEach(attribute => {
			if (attribute.isSpread) {
				args.push(attribute.expression.snippet);
			} else {
				if (attribute.name === 'value' && node.name === 'textarea') {
					textareaContents = attribute.stringifyForSsr();
				} else if (attribute.isTrue) {
					args.push(`{ ${quoteNameIfNecessary(attribute.name)}: true }`);
				} else if (
					booleanAttributes.has(attribute.name) &&
					attribute.chunks.length === 1 &&
					attribute.chunks[0].type !== 'Text'
				) {
					// a boolean attribute with one non-Text chunk
					args.push(`{ ${quoteNameIfNecessary(attribute.name)}: ${attribute.chunks[0].snippet} }`);
				} else {
					args.push(`{ ${quoteNameIfNecessary(attribute.name)}: \`${attribute.stringifyForSsr()}\` }`);
				}
			}
		});

		openingTag += "${@spread([" + args.join(', ') + "])}";
	} else {
		node.attributes.forEach((attribute: Node) => {
			if (attribute.type !== 'Attribute') return;

			if (attribute.name === 'value' && node.name === 'textarea') {
				textareaContents = attribute.stringifyForSsr();
			} else if (attribute.isTrue) {
				openingTag += ` ${attribute.name}`;
			} else if (
				booleanAttributes.has(attribute.name) &&
				attribute.chunks.length === 1 &&
				attribute.chunks[0].type !== 'Text'
			) {
				// a boolean attribute with one non-Text chunk
				openingTag += '${' + attribute.chunks[0].snippet + ' ? " ' + attribute.name + '" : "" }';
			} else if (attribute.name === 'class' && classExpr) {
				addClassAttribute = false;
				openingTag += ` class="\${ [\`${attribute.stringifyForSsr()}\`, ${classExpr} ].join(' ').trim() }"`;
			} else {
				openingTag += ` ${attribute.name}="${attribute.stringifyForSsr()}"`;
			}
		});
	}

	if (addClassAttribute) {
		openingTag += ` class="\${ [${classExpr}].join(' ').trim() }"`;
	}

	openingTag += '>';

	target.append(openingTag);

	if (node.name === 'textarea' && textareaContents !== undefined) {
		target.append(textareaContents);
	} else {
		fragment(node.children, target);
	}

	if (!isVoidElementName(node.name)) {
		target.append(`</${node.name}>`);
	}
}