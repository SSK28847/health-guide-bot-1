import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { toast } from 'sonner';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
}

// Map language codes to BCP 47 language tags for speech recognition
const LANGUAGE_TO_SPEECH_CODE: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ar: 'ar-SA',
  zh: 'zh-CN',
  pt: 'pt-BR',
  bn: 'bn-IN',
  ta: 'ta-IN',
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, initialValue }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t, language } = useLanguage();

  const { isListening, transcript, isSupported, toggleListening } = useVoiceRecognition({
    language: LANGUAGE_TO_SPEECH_CODE[language],
    onResult: (text) => {
      setInput((prev) => prev + (prev ? ' ' : '') + text);
    },
    onError: (error) => {
      toast.error(t('voiceError'));
      console.error('Voice recognition error:', error);
    },
  });

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  // Update input with interim transcript while listening
  useEffect(() => {
    if (isListening && transcript) {
      // Show interim results in a lighter way
    }
  }, [transcript, isListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceClick = () => {
    if (!isSupported) {
      toast.error(t('voiceNotSupported'));
      return;
    }
    toggleListening();
    if (!isListening) {
      toast.info(t('voiceListening'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? t('voiceListening') : t('placeholder')}
            disabled={disabled || isListening}
            className="min-h-[52px] max-h-32 resize-none bg-background pr-12"
            rows={1}
          />
          <Button
            type="button"
            onClick={handleVoiceClick}
            disabled={disabled}
            variant={isListening ? "destructive" : "ghost"}
            size="icon"
            className={`absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 ${
              isListening ? 'animate-pulse' : ''
            }`}
            title={isListening ? t('voiceStop') : t('voiceStart')}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span className="sr-only">{isListening ? t('voiceStop') : t('voiceStart')}</span>
          </Button>
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || disabled || isListening}
          size="icon"
          className="h-[52px] w-[52px] flex-shrink-0"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">{t('send')}</span>
        </Button>
      </div>
      {isListening && (
        <div className="max-w-4xl mx-auto mt-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            {t('voiceListening')}
          </p>
        </div>
      )}
    </form>
  );
};

export default ChatInput;
