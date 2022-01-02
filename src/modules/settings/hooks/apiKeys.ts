import { SettingsService } from "../services/settings";

export const getAPIKey = async () => await SettingsService.getAPIKey();

export const generateAPIKey = async () =>
  await SettingsService.generateAPIKey();

export const removeAPIKey = async () => await SettingsService.removeAPIKey();
