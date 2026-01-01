import React from 'react';
import { Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TypingIndicator: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3 animate-slide-in">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-accent-foreground" />
      </div>
      <div className="bg-chat-bot border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-1" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-2" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-3" />
          </div>
          <span className="text-xs text-muted-foreground">{t('typing')}</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
