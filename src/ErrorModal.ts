import { Modal, App, Notice } from 'obsidian';

export class ErrorModal extends Modal {
	message: string;

	constructor(app: App, message: string) {
		super(app);
		this.message = message;
	}

	onOpen() {
		const { contentEl } = this;

		// Créer un élément de paragraphe pour le message
		const messageEl = contentEl.createEl('p');
		messageEl.setText(this.message);

		// Créer un bouton en dessous du message
		const okButton = contentEl.createEl('button', {
			text: 'OK',
			cls: 'mod-cta'  // Utilise une classe pour ajouter des styles spécifiques si nécessaire
		});
		okButton.addEventListener('click', () => {
			this.close();
		});

		// Ajouter une classe CSS au conteneur pour appliquer les styles définis
		contentEl.addClass('error-modal-content');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// Utilisation:
function showError(app: App, message: string) {
	new ErrorModal(app, message).open();
}

// Appeler showError quelque part dans ton code avec l'instance d'App et le message d'erreur :
// showError(app, 'Une erreur est survenue, veuillez réessayer.');
