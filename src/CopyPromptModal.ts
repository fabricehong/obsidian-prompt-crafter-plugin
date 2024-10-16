import { App, Modal, Setting } from "obsidian";

export class CopyPromptModal extends Modal {
	prompt: string;
	onSubmit: (result: string) => void;

	constructor(app: App, prompt: string, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.prompt = prompt;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "Prompt" });

		const textarea = contentEl.createEl("textarea", {
			attr: {
				style: "width: 100%; box-sizing: border-box; margin-bottom: 20px;" // Assure que le textarea prend toute la largeur et ajoute un peu d'espace en dessous
			}
		});
		textarea.value = this.prompt;
		textarea.rows = 10;

		const buttonContainer = contentEl.createEl("div", {
			attr: {
				style: "text-align: right;" // Alignement du bouton à droite
			}
		});

		const button = buttonContainer.createEl("button", { text: "Copy" });
		button.addClass("mod-cta");
		button.addEventListener("click", () => {
			this.close();
			this.onSubmit(textarea.value);
		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
