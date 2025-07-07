import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/translations';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages: { code: Language; label: string }[] = [
    { code: 'id', label: 'ID' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-custom-light border border-white/40">
      {languages.map(({ code, label }) => (
        <Button
          key={code}
          variant={currentLanguage === code ? 'default' : 'ghost'}
          size="sm"
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 btn-hover-scale ${
            currentLanguage === code
              ? 'gradient-bg text-white shadow-custom-light'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
          onClick={() => onLanguageChange(code)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
