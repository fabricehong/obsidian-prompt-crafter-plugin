import { computePlaceHoldersMarkdownLevel, relevelMarkdownHeaders } from "./markdown-leveler";

export const PLACEHOLDER_REGEX = '\\{\\{([\\w-]+)\\}\\}';

export class Prompt {
	constructor(
		public readonly template: string,
		private readonly filepath: string,
		private readonly section: string | undefined = undefined
	) {}

	public remplacePlaceholders(variables: {[key: string]: string}): string {
		const placeholdersLevels = computePlaceHoldersMarkdownLevel(this.template);
		return this.template.replace(new RegExp(PLACEHOLDER_REGEX, 'g'), (match, variableName) => {
			if (!variables.hasOwnProperty(variableName)) {
				throw new Error(`Variable '${variableName}' not found`);
			}
			const placeholderLevel = placeholdersLevels[variableName];
			const markdown = variables[variableName];
			return relevelMarkdownHeaders(markdown, placeholderLevel + 1);
		});
	}

	public isEqual(other: Prompt): boolean {
		return this.filepath === other.filepath && this.section === other.section;
	}

	public getPromptId(): string {
		return !!this.section ? `${this.filepath}#${this.section}` : this.filepath;
	}

}
