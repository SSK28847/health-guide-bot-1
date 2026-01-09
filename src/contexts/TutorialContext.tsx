import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface TutorialStep {
  id: string;
  targetSelector: string;
  titleKey: string;
  descriptionKey: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  isInteractive?: boolean;
  interactionHint?: string;
}

// Define the tutorial steps for the medical chatbot
export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    targetSelector: '[data-tutorial="logo"]',
    titleKey: 'tutorialWelcomeTitle',
    descriptionKey: 'tutorialWelcomeDesc',
    position: 'right',
  },
  {
    id: 'language',
    targetSelector: '[data-tutorial="language"]',
    titleKey: 'tutorialLanguageTitle',
    descriptionKey: 'tutorialLanguageDesc',
    position: 'right',
    isInteractive: true,
    interactionHint: 'tutorialLanguageHint',
  },
  {
    id: 'theme',
    targetSelector: '[data-tutorial="theme"]',
    titleKey: 'tutorialThemeTitle',
    descriptionKey: 'tutorialThemeDesc',
    position: 'right',
    isInteractive: true,
    interactionHint: 'tutorialThemeHint',
  },
  {
    id: 'quick-topics',
    targetSelector: '[data-tutorial="quick-topics"]',
    titleKey: 'tutorialQuickTopicsTitle',
    descriptionKey: 'tutorialQuickTopicsDesc',
    position: 'right',
    isInteractive: true,
    interactionHint: 'tutorialQuickTopicsHint',
  },
  {
    id: 'common-conditions',
    targetSelector: '[data-tutorial="common-conditions"]',
    titleKey: 'tutorialConditionsTitle',
    descriptionKey: 'tutorialConditionsDesc',
    position: 'right',
  },
  {
    id: 'chat-input',
    targetSelector: '[data-tutorial="chat-input"]',
    titleKey: 'tutorialChatInputTitle',
    descriptionKey: 'tutorialChatInputDesc',
    position: 'top',
    isInteractive: true,
    interactionHint: 'tutorialChatInputHint',
  },
  {
    id: 'voice-input',
    targetSelector: '[data-tutorial="voice-input"]',
    titleKey: 'tutorialVoiceTitle',
    descriptionKey: 'tutorialVoiceDesc',
    position: 'top',
  },
  {
    id: 'example-questions',
    targetSelector: '[data-tutorial="example-questions"]',
    titleKey: 'tutorialExamplesTitle',
    descriptionKey: 'tutorialExamplesDesc',
    position: 'bottom',
    isInteractive: true,
    interactionHint: 'tutorialExamplesHint',
  },
];

interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  totalSteps: number;
  startTutorial: () => void;
  endTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  hasSeenTutorial: boolean;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const TUTORIAL_STORAGE_KEY = 'medical-chatbot-tutorial-seen';

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  });

  // Auto-start tutorial for first-time users
  useEffect(() => {
    if (!hasSeenTutorial) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial]);

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setHasSeenTutorial(true);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      endTutorial();
    }
  }, [currentStepIndex, endTutorial]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTutorial = useCallback(() => {
    endTutorial();
  }, [endTutorial]);

  const resetTutorial = useCallback(() => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setHasSeenTutorial(false);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const currentStep = isActive ? TUTORIAL_STEPS[currentStepIndex] : null;

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: TUTORIAL_STEPS.length,
        startTutorial,
        endTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        hasSeenTutorial,
        resetTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
