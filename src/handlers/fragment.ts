import AwaitBlock from './AwaitBlock';
import Comment from './Comment';
import Component from './Component';
import DebugTag from './DebugTag';
import EachBlock from './EachBlock';
import Element from './Element';
import Head from './Head';
import HtmlTag from './HtmlTag';
import IfBlock from './IfBlock';
import Slot from './Slot';
import Tag from './Tag';
import Text from './Text';
import Title from './Title';

type Handler = (node: any, target: any, options: any) => void;

function noop(){}

const handlers: Record<string, Handler> = {
	AwaitBlock,
	Comment,
	Component,
	DebugTag,
	EachBlock,
	Element,
	Head,
	IfBlock,
	MustacheTag: Tag, // TODO MustacheTag is an anachronism
	RawMustacheTag: HtmlTag,
	Slot,
	Text,
	Title,
	Window: noop
};

export default function(nodes, target, options) {
	nodes.forEach(node => {
		const handler = handlers[node.type];

		if (!handler) {
			throw new Error(`No handler for '${node.type}' nodes`);
		}

		handler(node, target, options);
	});
}