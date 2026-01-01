import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Header & Navigation
  appTitle: {
    en: 'Medical Assistant',
    hi: 'चिकित्सा सहायक',
  },
  disclaimer: {
    en: 'For informational purposes only. Always consult a healthcare professional.',
    hi: 'केवल जानकारी के लिए। हमेशा स्वास्थ्य पेशेवर से परामर्श करें।',
  },
  // Sidebar
  quickTopics: {
    en: 'Quick Topics',
    hi: 'त्वरित विषय',
  },
  symptoms: {
    en: 'Symptoms',
    hi: 'लक्षण',
  },
  prevention: {
    en: 'Prevention',
    hi: 'रोकथाम',
  },
  firstAid: {
    en: 'First Aid',
    hi: 'प्राथमिक चिकित्सा',
  },
  whenToSeeDoctor: {
    en: 'When to See Doctor',
    hi: 'डॉक्टर को कब दिखाएं',
  },
  commonConditions: {
    en: 'Common Conditions',
    hi: 'सामान्य स्थितियाँ',
  },
  fever: {
    en: 'Fever',
    hi: 'बुखार',
  },
  headache: {
    en: 'Headache',
    hi: 'सिरदर्द',
  },
  cough: {
    en: 'Cough & Cold',
    hi: 'खांसी और जुकाम',
  },
  diabetes: {
    en: 'Diabetes',
    hi: 'मधुमेह',
  },
  dengue: {
    en: 'Dengue',
    hi: 'डेंगू',
  },
  // Chat
  placeholder: {
    en: 'Ask about symptoms, conditions, or first aid...',
    hi: 'लक्षण, स्थितियों, या प्राथमिक चिकित्सा के बारे में पूछें...',
  },
  send: {
    en: 'Send',
    hi: 'भेजें',
  },
  typing: {
    en: 'Typing...',
    hi: 'टाइप कर रहा है...',
  },
  welcomeTitle: {
    en: 'Welcome to Medical Assistant',
    hi: 'चिकित्सा सहायक में आपका स्वागत है',
  },
  welcomeMessage: {
    en: 'I can help you with general health information, symptoms, prevention tips, and first aid guidance. Remember, I provide information only - always consult a doctor for proper diagnosis.',
    hi: 'मैं आपको सामान्य स्वास्थ्य जानकारी, लक्षण, रोकथाम युक्तियाँ और प्राथमिक चिकित्सा मार्गदर्शन में मदद कर सकता हूं। याद रखें, मैं केवल जानकारी प्रदान करता हूं - उचित निदान के लिए हमेशा डॉक्टर से परामर्श करें।',
  },
  exampleQuestions: {
    en: 'Example questions:',
    hi: 'उदाहरण प्रश्न:',
  },
  example1: {
    en: 'What are the symptoms of dengue?',
    hi: 'डेंगू के लक्षण क्या हैं?',
  },
  example2: {
    en: 'How can I prevent diabetes?',
    hi: 'मैं मधुमेह को कैसे रोक सकता हूं?',
  },
  example3: {
    en: 'What should I do for a mild fever?',
    hi: 'हल्के बुखार के लिए मुझे क्या करना चाहिए?',
  },
  // Emergency
  emergencyTitle: {
    en: '🚨 EMERGENCY DETECTED',
    hi: '🚨 आपातकालीन स्थिति',
  },
  emergencyMessage: {
    en: 'This may be a medical emergency. Please call emergency services immediately!',
    hi: 'यह एक चिकित्सा आपातकाल हो सकता है। कृपया तुरंत आपातकालीन सेवाओं को कॉल करें!',
  },
  emergencyNumbers: {
    en: 'Emergency Numbers (India): 112 | 102 | 108',
    hi: 'आपातकालीन नंबर (भारत): 112 | 102 | 108',
  },
  // Reminder
  consultDoctor: {
    en: '📋 Please consult a healthcare professional for proper diagnosis and treatment.',
    hi: '📋 कृपया उचित निदान और उपचार के लिए स्वास्थ्य पेशेवर से परामर्श करें।',
  },
  getCheckup: {
    en: '🏥 GET A CHECK-UP',
    hi: '🏥 जांच करवाएं',
  },
  checkupReminder: {
    en: 'This information is not a substitute for professional medical advice. Schedule a check-up with your doctor.',
    hi: 'यह जानकारी पेशेवर चिकित्सा सलाह का विकल्प नहीं है। अपने डॉक्टर के साथ जांच का समय निर्धारित करें।',
  },
  // Language
  language: {
    en: 'Language',
    hi: 'भाषा',
  },
  english: {
    en: 'English',
    hi: 'अंग्रेज़ी',
  },
  hindi: {
    en: 'हिंदी',
    hi: 'हिंदी',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('medical-chatbot-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('medical-chatbot-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
