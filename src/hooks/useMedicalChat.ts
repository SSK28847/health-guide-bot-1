import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Message } from '@/components/medical/ChatMessage';

// Emergency keywords for detection
const EMERGENCY_KEYWORDS = [
  // English
  'chest pain', 'heart attack', 'stroke', 'unconscious', 'not breathing',
  'severe bleeding', 'choking', 'seizure', 'overdose', 'suicide',
  'can\'t breathe', 'difficulty breathing', 'fainting', 'collapsed',
  // Hindi
  'सीने में दर्द', 'दिल का दौरा', 'बेहोश', 'सांस नहीं', 'गंभीर रक्तस्राव',
  'दम घुटना', 'दौरा', 'आत्महत्या',
];

const detectEmergency = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

export const useMedicalChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const { language } = useLanguage();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check for emergency keywords
    const isEmergency = detectEmergency(content);
    if (isEmergency) {
      setShowEmergency(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke('medical-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          language,
          isEmergency,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        isEmergency,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: language === 'en'
          ? 'I apologize, but I encountered an error. Please try again. If this persists, please consult a healthcare professional directly.'
          : 'मुझे क्षमा करें, लेकिन एक त्रुटि हुई। कृपया पुनः प्रयास करें। यदि यह जारी रहता है, तो कृपया सीधे स्वास्थ्य पेशेवर से परामर्श करें।',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  const clearEmergency = useCallback(() => {
    setShowEmergency(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setShowEmergency(false);
  }, []);

  return {
    messages,
    isLoading,
    showEmergency,
    sendMessage,
    clearEmergency,
    clearMessages,
  };
};
