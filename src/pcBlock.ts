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
				this.blockTgHandler(source, el, ctx);
			}
		);
	}

	async blockTgHandler(
		source: string,
		container: HTMLElement,
		{ sourcePath: path }: MarkdownPostProcessorContext
	) {
		setTimeout(async () => {
			const preElement = document.createElement('pre');
			preElement.style.whiteSpace = 'pre-wrap'; // Garde les sauts de ligne et espaces

			// Création d'un élément code qui contiendra le texte
			const codeElement = document.createElement('code');
			codeElement.textContent = source; // Assigne le contenu source à l'élément code

			// Ajoute l'élément code à l'élément pre
			preElement.appendChild(codeElement);

			// Ajoute l'élément pre au container pour l'affichage
			container.appendChild(preElement);

			this.addTGMenu(container, source, path);
		}, 100);
	}

	private addTGMenu(
		el: HTMLElement,
		source: string,
		sourcePath: string
	) {
		const div = document.createElement("div");
		div.classList.add("plug-tg-tgmenu", "plug-tg-flex", "plug-tg-justify-end");
		const generateSVG = `<svg viewBox="0 0 100 100" class="svg-icon GENERATE_ICON"><defs><style>.cls-1{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:4px;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="VECTOR"><rect class="cls-1" x="74.98" y="21.55" width="18.9" height="37.59"></rect><path class="cls-1" d="M38.44,27.66a8,8,0,0,0-8.26,1.89L24.8,34.86a25.44,25.44,0,0,0-6,9.3L14.14,56.83C11.33,64.7,18.53,67.3,21,60.9" transform="translate(-1.93 -15.75)"></path><polyline class="cls-1" points="74.98 25.58 56.61 18.72 46.72 15.45"></polyline><path class="cls-1" d="M55.45,46.06,42.11,49.43,22.76,50.61c-8.27,1.3-5.51,11.67,4.88,12.8L46.5,65.78,53,68.4a23.65,23.65,0,0,0,17.9,0l6-2.46" transform="translate(-1.93 -15.75)"></path><path class="cls-1" d="M37.07,64.58v5.91A3.49,3.49,0,0,1,33.65,74h0a3.49,3.49,0,0,1-3.45-3.52V64.58" transform="translate(-1.93 -15.75)"></path><path class="cls-1" d="M48,66.58v5.68a3.4,3.4,0,0,1-3.34,3.46h0a3.4,3.4,0,0,1-3.34-3.45h0V65.58" transform="translate(-1.93 -15.75)"></path><polyline class="cls-1" points="28.75 48.05 22.66 59.3 13.83 65.61 14.41 54.5 19.11 45.17"></polyline><polyline class="cls-1" points="25.17 34.59 43.75 0.25 52.01 5.04 36.39 33.91"></polyline><line class="cls-1" x1="0.25" y1="66.92" x2="13.83" y2="66.92"></line></g></g></svg>`;

		const button = this.createRunButton("Generate Text", generateSVG);
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

	createRunButton(label: string, svg: string) {
		const button = document.createElement("div");
		button.classList.add("clickable-icon");
		button.setAttribute("aria-label", label);
		//aria-label-position="right"
		button.innerHTML = svg;

		return button;
	}

}
