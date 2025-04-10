'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

export const useLang = () => useContext(LangContext);

// Função para carregar as traduções
const loadTranslations = (lang) => {
  return import(`../../public/locales/${lang}.json`); // Carrega o arquivo JSON com base no idioma
};

export const LangProvider = ({ children }) => {
  // Verifica se há um idioma salvo no localStorage, caso contrário, usa 'en' como padrão
  const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const [language, setLanguage] = useState(storedLanguage || 'en'); // Inicializa com o valor do localStorage ou 'en'
  const [translations, setTranslations] = useState({}); // Traduções

  // Atualiza as traduções sempre que o idioma mudar
  useEffect(() => {
    const fetchTranslations = async () => {
      const langData = await loadTranslations(language); // Carrega as traduções
      setTranslations(langData.default); // Atualiza as traduções no estado
    };

    fetchTranslations(); // Executa a função de carga de traduções
  }, [language]); // Recarrega as traduções sempre que o idioma mudar

  // Função para alterar o idioma e salvar no localStorage
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // Salva o idioma no localStorage
  };

  return (
    <LangContext.Provider value={{ language, changeLanguage, translations }}>
      {children}
    </LangContext.Provider>
  );
};
