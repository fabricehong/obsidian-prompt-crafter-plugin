import { computePlaceHoldersMarkdownLevel, relevelMarkdownHeaders } from "./markdown-leveler";
import { getVariables, removeFrontmatter } from "./pc-block-utils";
import { Prompt } from "./prompt";

describe('Prompt', () => {
	it('remplacePlaceholders: variable replacement', () => {
		const variables = { 'my-variable': 'bob-dylan' };
		const expected = 'Hello bob-dylan !';
		const prompt = new Prompt('Hello {{my-variable}} !', '');
		expect(prompt.remplacePlaceholders(variables)).toStrictEqual(expected);
	});


	it('remplacePlaceholders: multiple time same variable', () => {
		const variables = { 'my-variable': 'Bob Dylan', 'a-compliment': 'nice haircut' };
		const expected = 'Hello Bob Dylan ! nice haircut, Bob Dylan :)';
		const prompt = new Prompt('Hello {{my-variable}} ! {{a-compliment}}, {{my-variable}} :)', '');
		expect(prompt.remplacePlaceholders(variables)).toStrictEqual(expected);
	});
});

describe('Prompt > relevel markdown', () => {
	it('remplacePlaceholders: variable replacement', () => {
		const template = `
{{var-1}}
# Header 1
{{var-2}}
`.trim();

		const var1Content = `
# var 1 header
var 1 content
`.trim();

		const var2Content = `
# var 2 header
var 2 content
`.trim();

		const variables = { 'var-1': var1Content, 'var-2': var2Content };
		const expected = `
# var 1 header
var 1 content
# Header 1
## var 2 header
var 2 content
`.trim();
		const prompt = new Prompt(template, '');
		expect(prompt.remplacePlaceholders(variables)).toStrictEqual(expected);
	});
});
