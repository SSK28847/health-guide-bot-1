import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmergencyBannerProps {
  show: boolean;
}

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ show }) => {
  const { t } = useLanguage();

  if (!show) return null;

  return (
    <div className="bg-emergency text-emergency-foreground px-4 py-3 animate-pulse-emergency">
      <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold">{t('emergencyTitle')}</p>
            <p className="text-sm opacity-90">{t('emergencyMessage')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emergency-foreground/20 px-4 py-2 rounded-lg">
          <Phone className="w-5 h-5" />
          <span className="font-bold">{t('emergencyNumbers')}</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
