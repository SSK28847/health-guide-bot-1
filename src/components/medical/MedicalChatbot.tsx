import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import MedicalSidebar from './MedicalSidebar';
import EmergencyBanner from './EmergencyBanner';
import CheckupReminder from './CheckupReminder';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';
import ChatInput from './ChatInput';
import { useMedicalChat } from '@/hooks/useMedicalChat';
import { useLanguage } from '@/contexts/LanguageContext';

const MedicalChatbot: React.FC = () => {
  const { messages, isLoading, showEmergency, sendMessage } = useMedicalChat();
  const [pendingQuestion, setPendingQuestion] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleQuickQuestion = (question: string) => {
    setPendingQuestion(question);
  };

  const handleSendMessage = (message: string) => {
    setPendingQuestion('');
    sendMessage(message);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <MedicalSidebar onQuickQuestion={handleQuickQuestion} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Emergency Banner */}
        <EmergencyBanner show={showEmergency} />

        {/* Header Disclaimer */}
        <header className="bg-card border-b border-border px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-warning">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{t('disclaimer')}</p>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <WelcomeMessage onExampleClick={handleSendMessage} />
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Checkup Reminder - Show after first conversation */}
        {messages.length > 0 && (
          <div className="px-4 pb-2">
            <div className="max-w-4xl mx-auto">
              <CheckupReminder />
            </div>
          </div>
        )}

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          initialValue={pendingQuestion}
        />
      </div>
    </div>
  );
};

export default MedicalChatbot;
