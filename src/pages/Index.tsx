import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MedicalChatbot from '@/components/medical/MedicalChatbot';

const Index = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MedicalChatbot />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
