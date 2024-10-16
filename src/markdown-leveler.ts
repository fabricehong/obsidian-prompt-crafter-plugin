import { PLACEHOLDER_REGEX } from "./prompt";

type PlaceholderLevels = { [placeholder: string]: number };

export function relevelMarkdownHeaders(markdown: string, targetBaseLevel: number): string {
	const lines = markdown.split('\n');
	let adjustedMarkdown = '';

	// Trouver le niveau minimum actuel des headers dans le markdown
	let minCurrentLevel = Infinity;
	lines.forEach(line => {
		const match = line.match(/^(#+)/);
		if (match) {
			const level = match[0].length;
			if (level < minCurrentLevel) {
				minCurrentLevel = level;
			}
		}
	});

	// Calculer le décalage nécessaire pour ajuster le niveau des headers
	const levelOffset = targetBaseLevel - minCurrentLevel;

	lines.forEach(line => {
		const match = line.match(/^(#+)(\s+.*)/);
		if (match) {
			let newLevel = match[1].length + levelOffset;
			if (newLevel < 1) newLevel = 1; // Assure que le niveau est au moins 1
			if (newLevel > 6) {
				// Si le niveau dépasse 6, convertir en texte en gras avec numérotation
				const boldText = `**${newLevel - 6}. ${match[2].trim()}**`;
				adjustedMarkdown += boldText + '\n';
			} else {
				const newHeader = `${'#'.repeat(newLevel)}${match[2]}`;
				adjustedMarkdown += newHeader + '\n';
			}
		} else {
			adjustedMarkdown += line + '\n';
		}
	});

	return adjustedMarkdown.trim();
}

export function computePlaceHoldersMarkdownLevel(markdown: string): PlaceholderLevels {
	const lines = markdown.split('\n');
	let currentLevel = 0;
	let result: PlaceholderLevels = {};

	lines.forEach(line => {
		// Détecter les niveaux de header
		const headerMatch = line.match(/^(#+)/);
		if (headerMatch) {
			currentLevel = headerMatch[0].length;
		}

		// Détecter les placeholders
		const placeholderMatches = [...line.matchAll(new RegExp(PLACEHOLDER_REGEX, 'g'))];
		placeholderMatches.forEach(match => {
			const placeholderName = match[1];
			if (placeholderName && !(placeholderName in result)) {
				// Assigner le niveau actuel au placeholder s'il n'a pas encore été trouvé
				result[placeholderName] = currentLevel;
			}
		});

		// Réinitialiser le niveau pour les lignes sans header
		if (!headerMatch && !line.trim().startsWith('{{')) {
			currentLevel = 0;
		}
	});

	return result;
}
