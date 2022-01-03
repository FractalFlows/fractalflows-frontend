import { SettingsService } from "../services/settings";

export const getAPIKey = async () => await SettingsService.getAPIKey();

export const createAPIKey = async () => await SettingsService.createAPIKey();

export const removeAPIKey = async () => await SettingsService.removeAPIKey();
