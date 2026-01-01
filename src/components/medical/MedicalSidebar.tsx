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
  Languages,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MedicalSidebarProps {
  onQuickQuestion: (question: string) => void;
}

const MedicalSidebar: React.FC<MedicalSidebarProps> = ({ onQuickQuestion }) => {
  const { language, setLanguage, t } = useLanguage();

  const quickTopics = [
    { icon: Stethoscope, label: t('symptoms'), question: language === 'en' ? 'What are common symptoms I should watch out for?' : 'मुझे किन सामान्य लक्षणों पर ध्यान देना चाहिए?' },
    { icon: Shield, label: t('prevention'), question: language === 'en' ? 'How can I prevent common illnesses?' : 'मैं सामान्य बीमारियों को कैसे रोक सकता हूं?' },
    { icon: HeartPulse, label: t('firstAid'), question: language === 'en' ? 'What are basic first aid tips?' : 'बुनियादी प्राथमिक चिकित्सा युक्तियाँ क्या हैं?' },
    { icon: UserCheck, label: t('whenToSeeDoctor'), question: language === 'en' ? 'When should I see a doctor?' : 'मुझे डॉक्टर से कब मिलना चाहिए?' },
  ];

  const commonConditions = [
    { icon: Thermometer, label: t('fever'), question: language === 'en' ? 'What should I do for a fever?' : 'बुखार होने पर मुझे क्या करना चाहिए?' },
    { icon: Brain, label: t('headache'), question: language === 'en' ? 'What causes headaches and how to relieve them?' : 'सिरदर्द का कारण क्या है और इसे कैसे कम करें?' },
    { icon: Wind, label: t('cough'), question: language === 'en' ? 'How do I treat a cough and cold at home?' : 'घर पर खांसी और जुकाम का इलाज कैसे करें?' },
    { icon: Activity, label: t('diabetes'), question: language === 'en' ? 'How can I prevent diabetes?' : 'मैं मधुमेह को कैसे रोक सकता हूं?' },
    { icon: Bug, label: t('dengue'), question: language === 'en' ? 'What are the symptoms of dengue?' : 'डेंगू के लक्षण क्या हैं?' },
  ];

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

      {/* Language Toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-sidebar-foreground">{t('language')}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "flex-1 text-xs",
              language === 'en' && "bg-primary text-primary-foreground"
            )}
            onClick={() => setLanguage('en')}
          >
            {t('english')}
          </Button>
          <Button
            variant={language === 'hi' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "flex-1 text-xs",
              language === 'hi' && "bg-primary text-primary-foreground"
            )}
            onClick={() => setLanguage('hi')}
          >
            {t('hindi')}
          </Button>
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
              onClick={() => onQuickQuestion(topic.question)}
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
              onClick={() => onQuickQuestion(condition.question)}
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
