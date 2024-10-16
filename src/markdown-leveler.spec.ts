import { computePlaceHoldersMarkdownLevel, relevelMarkdownHeaders } from "./markdown-leveler";

describe('relevelMarkdownHeaders', () => {

	describe('relevel: +1', () => {
		it('should relevel markdown headers based on the given base level', () => {
			const markdown = `# Header 1\n## Header 2\n### Header 3`;
			const baseLevel = 2;
			const expected = `## Header 1\n### Header 2\n#### Header 3`;

			expect(relevelMarkdownHeaders(markdown, baseLevel)).toBe(expected);
		});

		it('relevel > exceeding level: bold header with numbering', () => {
			const markdown = `# Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6\n####### Header 7`;
			const baseLevel = 1;
			const expected = `# Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6\n**1. Header 7**`;

			expect(relevelMarkdownHeaders(markdown, baseLevel)).toBe(expected);
		});
	});

	it('relevel: -1', () => {
		const markdown = `## Header 1\n### Header 2\n#### Header 3`;
		const baseLevel = 1;
		const expected = `# Header 1\n## Header 2\n### Header 3`;

		expect(relevelMarkdownHeaders(markdown, baseLevel)).toBe(expected);
	});

});

describe('computePlaceHoldersMarkdownLevel', () => {
	it('basic case', () => {
		const markdown = `# Header 1\n## Header 2\n### Header 3\n{{variable}}`;
		const expected = { 'variable': 3 };

		expect(computePlaceHoldersMarkdownLevel(markdown)).toEqual(expected);
	});

	it('level 0', () => {
		const markdown = `{{variable}}`;
		const expected = { 'variable': 0 };

		expect(computePlaceHoldersMarkdownLevel(markdown)).toEqual(expected);
	});

});
