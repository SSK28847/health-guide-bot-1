import React from 'react';
import { Stethoscope, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  onExampleClick: (question: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onExampleClick }) => {
  const { t } = useLanguage();

  const examples = [
    t('example1'),
    t('example2'),
    t('example3'),
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Stethoscope className="w-10 h-10 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-3">
        {t('welcomeTitle')}
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {t('welcomeMessage')}
      </p>

      <div className="w-full max-w-md">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          {t('exampleQuestions')}
        </p>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => onExampleClick(example)}
            >
              <MessageCircle className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
              <span className="text-sm">{example}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
