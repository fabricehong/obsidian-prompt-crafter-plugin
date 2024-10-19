import { MarkdownPostProcessorContext, Notice } from "obsidian";
import PromptCrafterPlugin from "./main";
import { PromptResolver } from "./prompt-resolver";
import { CopyPromptModal } from "./CopyPromptModal";
import { Prompt } from "./prompt";
import { ErrorModal } from "./ErrorModal";

export const BLOCK_NAME = 'pc';
export default class PcBlock {
	plugin: PromptCrafterPlugin;
	constructor(plugin: PromptCrafterPlugin) {
		this.plugin = plugin;

		this.plugin.registerMarkdownCodeBlockProcessor(
			BLOCK_NAME,
			async (source, el, ctx) => {
				this.blockPcHandler(source, el, ctx);
			}
		);
	}

	async blockPcHandler(
		source: string,
		container: HTMLElement,
		{ sourcePath: path }: MarkdownPostProcessorContext
	) {
		setTimeout(async () => {
			const preElement = document.createElement('pre');

			preElement.classList.add('pc-pre');

			// Création d'un élément code qui contiendra le texte
			const codeElement = document.createElement('code');
			codeElement.textContent = source; // Assigne le contenu source à l'élément code

			// Ajoute l'élément code à l'élément pre
			preElement.appendChild(codeElement);

			// Ajoute l'élément pre au container pour l'affichage
			container.appendChild(preElement);

			this.addPCMenu(container, source, path);
		}, 100);
	}

	private addPCMenu(
		el: HTMLElement,
		source: string,
		sourcePath: string
	) {
		const div = document.createElement("div");
		div.classList.add("plug-pc-pcmenu", "plug-pc-flex", "plug-pc-justify-end");

		const button = this.createRunButton("Generate Text");
		button.addEventListener("click", async () => {
			console.log('trigger');


			try {
				const promptResolver = new PromptResolver(this.plugin.app);
				let resolvedPrompt = await promptResolver.resolvePrompt(new Prompt(source, sourcePath), sourcePath);

				new CopyPromptModal(this.plugin.app, resolvedPrompt, (result: string) => {
					this.copyToClipboard(result);
					new Notice("Prompt copied to clipboard", 3000);
				}).open();
			} catch (e) {
				new ErrorModal(this.plugin.app, e.message).open();
				throw e;
			}
		});

		div.appendChild(button);
		el.parentElement?.appendChild(div);
	}

	private async copyToClipboard(texte: string) {
		try {
			await navigator.clipboard.writeText(texte);
			console.log('Texte copié dans le presse-papier');
		} catch (err) {
			console.error('Erreur lors de la copie dans le presse-papier', err);
		}
	}

	createRunButton(label: string) {
		// Création du bouton avec createEl() pour plus de sécurité
		const button = document.createElement("div");
		button.classList.add("clickable-icon");
		button.setAttribute("aria-label", label);

		// Création sécurisée de l'élément SVG
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 100 100");
		svg.classList.add("svg-icon", "GENERATE_ICON");

		// Création du groupe principal
		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.setAttribute("id", "Layer_2");
		g.setAttribute("data-name", "Layer 2");

		// Création du sous-groupe
		const vectorGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		vectorGroup.setAttribute("id", "VECTOR");

		// Définir les styles communs
		const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
		style.textContent = ".cls-1{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:4px;}";
		svg.appendChild(style);

		// Création de chaque élément SVG
		const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute("class", "cls-1");
		rect.setAttribute("x", "74.98");
		rect.setAttribute("y", "21.55");
		rect.setAttribute("width", "18.9");
		rect.setAttribute("height", "37.59");

		const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path1.setAttribute("class", "cls-1");
		path1.setAttribute("d", "M38.44,27.66a8,8,0,0,0-8.26,1.89L24.8,34.86a25.44,25.44,0,0,0-6,9.3L14.14,56.83C11.33,64.7,18.53,67.3,21,60.9");

		const polyline1 = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		polyline1.setAttribute("class", "cls-1");
		polyline1.setAttribute("points", "74.98 25.58 56.61 18.72 46.72 15.45");

		const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path2.setAttribute("class", "cls-1");
		path2.setAttribute("d", "M55.45,46.06,42.11,49.43,22.76,50.61c-8.27,1.3-5.51,11.67,4.88,12.8L46.5,65.78,53,68.4a23.65,23.65,0,0,0,17.9,0l6-2.46");

		const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path3.setAttribute("class", "cls-1");
		path3.setAttribute("d", "M37.07,64.58v5.91A3.49,3.49,0,0,1,33.65,74h0a3.49,3.49,0,0,1-3.45-3.52V64.58");

		const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path4.setAttribute("class", "cls-1");
		path4.setAttribute("d", "M48,66.58v5.68a3.4,3.4,0,0,1-3.34,3.46h0a3.4,3.4,0,0,1-3.34-3.45h0V65.58");

		const polyline2 = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		polyline2.setAttribute("class", "cls-1");
		polyline2.setAttribute("points", "28.75 48.05 22.66 59.3 13.83 65.61 14.41 54.5 19.11 45.17");

		const polyline3 = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		polyline3.setAttribute("class", "cls-1");
		polyline3.setAttribute("points", "25.17 34.59 43.75 0.25 52.01 5.04 36.39 33.91");

		const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("class", "cls-1");
		line.setAttribute("x1", "0.25");
		line.setAttribute("y1", "66.92");
		line.setAttribute("x2", "13.83");
		line.setAttribute("y2", "66.92");

		// Ajout des éléments au groupe vecteur
		vectorGroup.appendChild(rect);
		vectorGroup.appendChild(path1);
		vectorGroup.appendChild(polyline1);
		vectorGroup.appendChild(path2);
		vectorGroup.appendChild(path3);
		vectorGroup.appendChild(path4);
		vectorGroup.appendChild(polyline2);
		vectorGroup.appendChild(polyline3);
		vectorGroup.appendChild(line);

		// Ajout du groupe vecteur au groupe principal
		g.appendChild(vectorGroup);
		svg.appendChild(g);

		// Ajout de l'élément SVG au bouton
		button.appendChild(svg);

		return button;
	}

}
