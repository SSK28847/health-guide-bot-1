import React from 'react';
import {
  Stethoscope,
  Shield,
  HeartPulse,
  UserCheck,
  Thermometer,
  Brain,
  Wind,
  Activity,
  Bug,
  Sun,
  Moon,
  Eye,
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, getQuickQuestions, Language } from '@/contexts/LanguageContext';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MedicalSidebarProps {
  onQuickQuestion: (question: string) => void;
}

const THEME_OPTIONS: { value: Theme; icon: typeof Sun; labelKey: string }[] = [
  { value: 'light', icon: Sun, labelKey: 'lightMode' },
  { value: 'dark', icon: Moon, labelKey: 'darkMode' },
  { value: 'eye-comfort', icon: Eye, labelKey: 'eyeComfortMode' },
];

const MedicalSidebar: React.FC<MedicalSidebarProps> = ({ onQuickQuestion }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const questions = getQuickQuestions(language);

  const quickTopics = [
    { icon: Stethoscope, label: t('symptoms'), questionKey: 'symptoms' as const },
    { icon: Shield, label: t('prevention'), questionKey: 'prevention' as const },
    { icon: HeartPulse, label: t('firstAid'), questionKey: 'firstAid' as const },
    { icon: UserCheck, label: t('whenToSeeDoctor'), questionKey: 'whenToSeeDoctor' as const },
  ];

  const commonConditions = [
    { icon: Thermometer, label: t('fever'), questionKey: 'fever' as const },
    { icon: Brain, label: t('headache'), questionKey: 'headache' as const },
    { icon: Wind, label: t('cough'), questionKey: 'cough' as const },
    { icon: Activity, label: t('diabetes'), questionKey: 'diabetes' as const },
    { icon: Bug, label: t('dengue'), questionKey: 'dengue' as const },
  ];

  const currentThemeOption = THEME_OPTIONS.find(opt => opt.value === theme);
  const ThemeIcon = currentThemeOption?.icon || Sun;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">{t('appTitle')}</h1>
            <p className="text-xs text-muted-foreground">AI Health Info</p>
          </div>
        </div>
      </div>

      {/* Language Dropdown */}
      <div className="p-4 border-b border-sidebar-border space-y-3">
        <div>
          <label className="text-sm font-medium text-sidebar-foreground mb-2 block">
            {t('language')}
          </label>
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder={t('selectLanguage')} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground text-xs">({lang.name})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Dropdown */}
        <div>
          <label className="text-sm font-medium text-sidebar-foreground mb-2 block">
            {t('theme')}
          </label>
          <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <ThemeIcon className="w-4 h-4" />
                  <span>{t(currentThemeOption?.labelKey || 'lightMode')}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {THEME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    <span>{t(option.labelKey)}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {t('quickTopics')}
        </h3>
        <div className="space-y-1">
          {quickTopics.map((topic, index) => (
            <button
              key={index}
              onClick={() => onQuickQuestion(questions[topic.questionKey] || '')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
            >
              <topic.icon className="w-4 h-4 text-primary" />
              {topic.label}
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {t('commonConditions')}
        </h3>
        <div className="space-y-1">
          {commonConditions.map((condition, index) => (
            <button
              key={index}
              onClick={() => onQuickQuestion(questions[condition.questionKey] || '')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
            >
              <condition.icon className="w-4 h-4 text-accent" />
              {condition.label}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="p-4 border-t border-sidebar-border bg-muted/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('disclaimer')}
        </p>
      </div>
    </aside>
  );
};

export default MedicalSidebar;
