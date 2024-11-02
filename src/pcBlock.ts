import { MarkdownPostProcessorContext, Notice } from "obsidian";
import PromptCrafterPlugin from "./main";
import { PromptResolver } from "./prompt-resolver";
import { CopyPromptModal } from "./CopyPromptModal";
import { Prompt } from "./prompt";
import { ErrorModal } from "./ErrorModal";
import { setIcon } from "obsidian";


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

			// Create code element that will contain the text
			const codeElement = document.createElement('code');
			codeElement.textContent = source; // assign source content to code element

			// add code element to pre
			preElement.appendChild(codeElement);

			// add pre element to container
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

		const button = this.createRunButton("Build prompt");
		button.addEventListener("click", async () => {
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
		} catch (err) {
			console.error('Erreur lors de la copie dans le presse-papier', err);
		}
	}

	createRunButton(label: string) {
		// create button
		const button = document.createElement("div");
		button.classList.add("clickable-icon");
		button.setAttribute("aria-label", label);

		// assign the build prompt icon
		setIcon(button, "build-prompt-icon");

		return button;
	}

}
