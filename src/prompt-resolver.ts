import { App, TFile } from "obsidian";
import { Prompt } from "./prompt";
import { getCodeBloc, removeFrontmatter } from "./pc-block-utils";
import { BLOCK_NAME } from "./pcBlock";

export class PromptResolver {
	constructor(private readonly app: App, private readonly promptHistory: Prompt[] = []) {}

	public async resolvePrompt(prompt: Prompt, sourceFile: string): Promise<string> {
		const newPromptHistory = this.promptHistory.concat(prompt);

		if (this.promptHistory.some((p) => p.isEqual(prompt))) {
			const chainDescription = newPromptHistory.map((p) => {
				if (p.isEqual(prompt)) {
					return `*${p.getPromptId()}*`;
				}
				return p.getPromptId();
			}).join(' -> ');
			throw new Error(`Circular reference detected: ${chainDescription}`);
		}
		const file = this.app.vault.getAbstractFileByPath(sourceFile);
		const variables: {[key: string]: string} = {}

		if (!(file instanceof TFile)) {
			throw new Error('no instance of TFile');
		}
		// Récupère le cache du fichier actuel pour accéder au frontmatter
		const fileCache = this.app.metadataCache.getFileCache(file);
		if (!fileCache) {
			throw new Error("No cache file found.");
		}
		const frontmatter = fileCache.frontmatter || {};

		for (const key in frontmatter) {
			const linktext = frontmatter[key];
			const linkTargetContent = await this.determineVariableValue(linktext, file.path);
			if (!linkTargetContent) {
				variables[key] = linktext;
			} else {
				const withoutFrontmatter = removeFrontmatter(linkTargetContent.content);
				const codeBlock = getCodeBloc(withoutFrontmatter);
				if (codeBlock) {
					if (codeBlock.blocType === BLOCK_NAME) {
						const newPrompt = new Prompt(
							codeBlock.content,
							linkTargetContent.filepath,
							linkTargetContent.section
						);
						const promptResolver = new PromptResolver(this.app, newPromptHistory);
						variables[key] = await promptResolver.resolvePrompt(newPrompt, linkTargetContent.filepath);
					} else {
						variables[key] = codeBlock.content;
					}
				} else {
					variables[key] = withoutFrontmatter;
				}
			}
		}

		return prompt.remplacePlaceholders(variables)
	}


	private async determineVariableValue(linktext: any, mainfilePath: string): Promise<{content: string, filepath: string, section: string | undefined} | undefined> {
		// Utilise parseLinktext pour extraire chemin et sous-chemin
		const parsed = this.parseLinktext(linktext);
		if (!parsed) {
			return undefined;
		}
		const { path, subpath } = parsed;

		// Résoudre le chemin du lien
		const destFile = this.app.metadataCache.getFirstLinkpathDest(path, mainfilePath);

		if (!destFile) {
			throw new Error(`File '${path}' not found`);
		}
		const linkedFile = this.app.vault.getAbstractFileByPath(destFile.path);
		if (!(linkedFile instanceof TFile)) {
			throw new Error('no instance of TFile');
		}
		// Lire le contenu du fichier lié
		let content = await this.app.vault.read(linkedFile);

		// Si un sous-chemin est spécifié, extraire la section spécifique du contenu
		let result;
		if (subpath) {
			result = this.extractSectionContent(content, subpath);
		} else {
			result = content;
		}

		return {
			content: result,
			filepath: destFile.path,
			section: subpath
		};
	}

	private parseLinktext(linktext: string): { path: string; subpath?: string } | undefined {
		// Ici, tu dois écrire du code pour analyser le lien et extraire le chemin et le sous-chemin
		// Cette fonction est un exemple de structure et doit être adaptée à ton besoin
		const match = linktext.match(/\[\[([^\]]+?)(#([^#]+?))?\]\]/);

		if (match) {
			const linkAndLabel = match[1].split('|');
			return { path: linkAndLabel[0], subpath: match[3] };
		}
		return undefined; // Cas par défaut si le lien n'est pas au format attendu
	}

	private extractSectionContent(content: string, subpath: string): string {
		const lines = content.split('\n');
		let sectionContent = '';
		let inSection = false;
		let currentLevel = 0;

		for (const line of lines) {
			const headerMatch = line.match(/^(#+)\s+(.*)/);
			if (headerMatch) {
				const level = headerMatch[1].length;
				const title = headerMatch[2].trim();

				if (inSection && level <= currentLevel) {
					// Si on est déjà dans la section et qu'on rencontre un header de niveau égal ou supérieur,
					// cela signifie qu'on a atteint la fin de la section d'intérêt.
					break;
				}

				if (title === subpath) {
					// Si le titre correspond au subpath recherché,
					// on commence à capturer le contenu à partir de ce point.
					inSection = true;
					currentLevel = level;
					continue; // Passe à l'itération suivante sans ajouter le titre lui-même au contenu.
				}
			}

			if (inSection) {
				// Ajoute la ligne courante au contenu de la section si on est dans la section d'intérêt.
				sectionContent += line + '\n';
			}
		}

		return sectionContent.trim();
	}
}
