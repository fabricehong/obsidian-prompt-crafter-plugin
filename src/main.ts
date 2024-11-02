import { addIcon, Plugin } from 'obsidian';
import PcBlock from "./pcBlock";
import { buildPromptIcon } from "./icons";

interface PromptCrafterPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PromptCrafterPluginSettings = {
	mySetting: 'default'
}

export default class PromptCrafterPlugin extends Plugin {
	settings: PromptCrafterPluginSettings;

	async onload() {
		await this.loadSettings();

		addIcon("build-prompt-icon", buildPromptIcon);

		new PcBlock(this);
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
