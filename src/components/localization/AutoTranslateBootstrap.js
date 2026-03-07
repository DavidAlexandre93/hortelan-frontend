import { useEffect } from 'react';
import {
  applyGoogleLanguage,
  detectLanguageByGeolocation,
  detectLanguageFromBrowser,
  ensureGoogleTranslate,
  ensureTranslateDomSetup,
  getStoredLanguage,
} from '../../services/localization';

export default function AutoTranslateBootstrap() {
  useEffect(() => {
    ensureTranslateDomSetup();
    ensureGoogleTranslate();

    const applyDetectedLanguage = async () => {
      const manualLanguage = getStoredLanguage();
      if (manualLanguage) {
        applyGoogleLanguage(manualLanguage);
        return;
      }

      try {
        const detectedLanguage = await detectLanguageByGeolocation();
        applyGoogleLanguage(detectedLanguage);
      } catch (error) {
        const fallbackLanguage = detectLanguageFromBrowser();
        applyGoogleLanguage(fallbackLanguage);
      }
    };

    applyDetectedLanguage();
  }, []);

  return null;
}
