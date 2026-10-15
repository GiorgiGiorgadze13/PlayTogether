import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, TranslationContent } from '../types/translations';
import { t } from '../constants/translations';

interface LanguageContextType {
  lang: Language;
  c: TranslationContent;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('playTogetherLang');
    return saved === 'en' || saved === 'ka' ? saved : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('playTogetherLang', newLang);
    document.documentElement.lang = newLang;
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ka' : 'en');
  };

  // Set document lang on mount
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const c = t[lang];

  return (
    <LanguageContext.Provider value={{ lang, c, setLang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
