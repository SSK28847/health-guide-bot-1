import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CheckupReminder: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-4 h-4 text-accent-foreground" />
        </div>
        <div>
          <p className="font-semibold text-accent text-sm">{t('getCheckup')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('checkupReminder')}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckupReminder;
