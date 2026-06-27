// i18n removed — Arabic support discontinued.
export const supportedLanguages = [{ code: 'en', name: 'English', dir: 'ltr' as const }];
export const defaultLanguage = 'en';
export const languageCodes = ['en'];
export function isLanguageSupported(code: string) { return code === 'en'; }
export function getLanguage(code: string) { return code === 'en' ? supportedLanguages[0] : undefined; }
export interface Language { code: string; name: string; dir: 'ltr' | 'rtl'; }
