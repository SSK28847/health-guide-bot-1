import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/contexts/TutorialContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TutorialButton: React.FC = () => {
  const { resetTutorial, hasSeenTutorial } = useTutorial();
  const { t } = useLanguage();

  if (!hasSeenTutorial) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetTutorial}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="sr-only">{t('tutorialRestart')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('tutorialRestart')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TutorialButton;
