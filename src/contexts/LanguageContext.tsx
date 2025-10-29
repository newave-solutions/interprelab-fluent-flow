import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'zh' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    solutions: 'Solutions',
    resources: 'Resources',
    about: 'About',
    contact: 'Contact',
    signIn: 'Sign In',
    signOut: 'Sign Out',
  },
  es: {
    solutions: 'Soluciones',
    resources: 'Recursos',
    about: 'Acerca de',
    contact: 'Contacto',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
  },
  fr: {
    solutions: 'Solutions',
    resources: 'Ressources',
    about: 'À propos',
    contact: 'Contact',
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
  },
  zh: {
    solutions: '解决方案',
    resources: '资源',
    about: '关于',
    contact: '联系',
    signIn: '登录',
    signOut: '登出',
  },
  ar: {
    solutions: 'الحلول',
    resources: 'الموارد',
    about: 'حول',
    contact: 'اتصل',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
