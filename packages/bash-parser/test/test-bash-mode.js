'use strict';

const test = require('ava');
const bashParser = require('../src');
const utils = require('./_utils');

test('alias on reserved word', t => {
	const result = bashParser('if world', {
		mode: 'bash',
		resolveAlias: name => {
			return name === 'if' ? 'echo' : undefined;
		}
	});
	utils.checkResults(t, result, {
		type: 'Script',
		commands: [{
			type: 'Command',
			name: {type: 'Word', text: 'echo'},
			suffix: [{type: 'Word', text: 'world'}]
		}]
	});
});

test('parameter substitution with Substring Expansion', t => {
	const result = bashParser('echo ${text:2:4}', {mode: 'bash'})
		.commands[0].suffix[0].expansion[0];

	utils.checkResults(t, result, {
		loc: {
			start: 0,
			end: 10
		},
		parameter: 'text',
		type: 'ParameterExpansion',
		op: 'substring',
		offset: 2,
		length: 4
	});
});
