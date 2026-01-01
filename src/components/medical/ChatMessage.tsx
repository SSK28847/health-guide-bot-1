import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isEmergency?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { t } = useLanguage();
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary" : "bg-accent"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-accent-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-chat-user text-foreground rounded-tr-sm"
            : "bg-chat-bot border border-border rounded-tl-sm",
          message.isEmergency && "border-2 border-emergency"
        )}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        
        {/* Consult Doctor Reminder for bot messages */}
        {!isUser && !message.isEmergency && (
          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50 italic">
            {t('consultDoctor')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
