import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    solutions: 'Solutions',
    interpreHub: 'InterpreHub',
    dashboard: 'Dashboard',
    settings: 'Settings',
    resources: 'Resources',
    about: 'About',
    contact: 'Contact',
    signIn: 'Sign In',
    signOut: 'Sign Out',
  },
  es: {
    solutions: 'Soluciones',
    interpreHub: 'InterpreHub',
    dashboard: 'Panel',
    settings: 'Configuración',
    resources: 'Recursos',
    about: 'Acerca de',
    contact: 'Contacto',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
  },
  fr: {
    solutions: 'Solutions',
    interpreHub: 'InterpreHub',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    resources: 'Ressources',
    about: 'À propos',
    contact: 'Contact',
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  availableLanguages: { code: string; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);

    // TODO: Save to user settings when user is available
    // This will be handled by a separate hook or service
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
