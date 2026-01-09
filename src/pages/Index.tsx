import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TutorialProvider } from '@/contexts/TutorialContext';
import MedicalChatbot from '@/components/medical/MedicalChatbot';
import TutorialOverlay from '@/components/tutorial/TutorialOverlay';

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TutorialProvider>
          <MedicalChatbot />
          <TutorialOverlay />
        </TutorialProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
