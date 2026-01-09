import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/contexts/TutorialContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface TutorialButtonProps {
  variant?: 'icon' | 'full';
  className?: string;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ variant = 'full', className }) => {
  const { resetTutorial, isActive } = useTutorial();
  const { t } = useLanguage();

  if (isActive) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={resetTutorial}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${className}`}
      >
        <GraduationCap className="w-4 h-4" />
        <span className="sr-only">{t('tutorialButton')}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={resetTutorial}
      className={`gap-2 w-full justify-start ${className}`}
    >
      <GraduationCap className="w-4 h-4" />
      {t('tutorialButton')}
    </Button>
  );
};

export default TutorialButton;
