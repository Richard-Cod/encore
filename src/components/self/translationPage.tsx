'use client'

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TranslationPage() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">{t('welcome')}</h1>
      <div className="mb-4">
        <p className="text-lg mb-2">{t('language')}: {currentLanguage}</p>
        <Select onValueChange={changeLanguage} defaultValue={currentLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('change_language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-x-4">
        <Button onClick={() => changeLanguage('en')}>English</Button>
        <Button onClick={() => changeLanguage('fr')}>Français</Button>
      </div>
    </div>
  );
}