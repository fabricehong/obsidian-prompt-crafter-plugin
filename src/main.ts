import { Plugin } from 'obsidian';
import PcBlock from "./pcBlock";

// Remember to rename these classes and interfaces!

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
