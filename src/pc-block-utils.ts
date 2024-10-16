export function getVariables(content: string): Set<string> {
	const regex = /{{([\w-]+)}}/g; // Modifié pour inclure des tirets dans les noms de variables
	let match;
	const variables = new Set<string>();

	while ((match = regex.exec(content)) !== null) {
		variables.add(match[1]);
	}
	return variables;
}


interface CodeBloc {
	content: string;
	blocType: string | undefined;
}

export function getCodeBloc(content: string): CodeBloc | undefined {
	const regex = /^\s*```(\w*)\n([\s\S]*?)\n```\s*$/;
	const correspondance = content.match(regex);
	if (correspondance) {
		return {
			content: correspondance[2].trim(),
			blocType: correspondance[1] === '' ? undefined : correspondance[1]
		};
	}
	return undefined; // Retourne undefined si aucun bloc de code n'est trouvé
}

export function removeFrontmatter(content: string) {
	// Cette expression régulière cherche les parties encadrées par "---" au début du texte
	const regex = /^---[\s\S]+?---\n?/;
	// Remplace le frontmatter par une chaîne vide s'il est trouvé
	return content.replace(regex, '');
}

